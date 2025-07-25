package io.inji.verify.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jose.jwk.gen.OctetKeyPairGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.presentation.FormatDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.exception.JWTCreationException;
import io.inji.verify.services.KeyManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.text.ParseException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceImplTest {

    @Mock
    private KeyManagementService<OctetKeyPair> mockKeyManagementService;

    @InjectMocks
    private JwtServiceImpl jwtService;

    private String testIssuerPublicKeyURI = "did:example:test#key-0";
    private OctetKeyPair testKeyPair;

    @BeforeEach
    void setUp() throws JOSEException {
        ReflectionTestUtils.setField(jwtService, "issuerPublicKeyURI", testIssuerPublicKeyURI);

        testKeyPair = new OctetKeyPairGenerator(Curve.Ed25519)
                .keyID("test-key")
                .generate();

        when(mockKeyManagementService.getKeyPair()).thenReturn(testKeyPair);
    }

    @Test
    @DisplayName("Should create and sign JWT with presentation_definition_uri claim")
    void createAndSignAuthorizationRequestJwt_WithPresentationDefinitionUri_Success() throws ParseException {
        String verifierDid = "did:inji:verifier";
        String state = "test_state_123";
        AuthorizationRequestResponseDto authzRequestDto = new AuthorizationRequestResponseDto(
        "cId",
        "https://definition.example.com/pd-1",
        null,
        "test_nonce_abc",
                "resURL");

        String jwtString = jwtService.createAndSignAuthorizationRequestJwt(verifierDid, authzRequestDto, state);

        assertNotNull(jwtString);
        assertFalse(jwtString.isEmpty());

        SignedJWT signedJWT = SignedJWT.parse(jwtString);

        JWSHeader header = signedJWT.getHeader();
        assertEquals(JWSAlgorithm.EdDSA, header.getAlgorithm());
        assertEquals(new JOSEObjectType("oauth-authz-req+jwt"), header.getType());
        assertEquals(testIssuerPublicKeyURI, header.getKeyID());

        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
        assertEquals(verifierDid, claimsSet.getIssuer().toString());
        assertEquals(verifierDid, claimsSet.getClaim("client_id").toString());
        assertEquals("vp_token", claimsSet.getClaim("response_type").toString());
        assertEquals("direct_post", claimsSet.getClaim("response_mode").toString());
        assertEquals(authzRequestDto.getNonce(), claimsSet.getClaim("nonce").toString());
        assertEquals(state, claimsSet.getClaim("state").toString());
        assertEquals(authzRequestDto.getResponseUri(), claimsSet.getClaim("response_uri").toString());
        assertEquals(authzRequestDto.getPresentationDefinitionUri(), claimsSet.getClaim("presentation_definition_uri").toString());

        assertNotNull(claimsSet.getClaim("presentation_definition_uri"));
        assertNull(claimsSet.getClaim("presentation_definition"));

        verify(mockKeyManagementService, times(1)).getKeyPair();
    }

    @Test
    @DisplayName("Should create and sign JWT with embedded presentation_definition claim")
    void createAndSignAuthorizationRequestJwt_WithPresentationDefinition_Success() throws JOSEException, JsonProcessingException, ParseException {
        String verifierDid = "did:inji:verifier-2";
        String state = "test_state_xyz";
        FormatDto formatDto = new FormatDto(null,null,null);
        VPDefinitionResponseDto dummyPresentationDefinition = new VPDefinitionResponseDto("test_id", null,"name","purpose",formatDto, null);
        AuthorizationRequestResponseDto authzRequestDto = new AuthorizationRequestResponseDto(
                "cId",
                null,
                dummyPresentationDefinition,
                "test_nonce_abc",
                "resURL");

        String jwtString = jwtService.createAndSignAuthorizationRequestJwt(verifierDid, authzRequestDto, state);

        assertNotNull(jwtString);
        assertFalse(jwtString.isEmpty());

        SignedJWT signedJWT = SignedJWT.parse(jwtString);

        JWSHeader header = signedJWT.getHeader();
        assertEquals(JWSAlgorithm.EdDSA, header.getAlgorithm());
        assertEquals(new JOSEObjectType("oauth-authz-req+jwt"), header.getType());
        assertEquals(testIssuerPublicKeyURI, header.getKeyID());

        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
        assertEquals(verifierDid, claimsSet.getIssuer());
        assertEquals(verifierDid, claimsSet.getClaim("client_id").toString());
        assertEquals(authzRequestDto.getResponseType(), claimsSet.getClaim("response_type").toString());
        assertEquals(authzRequestDto.getNonce(), claimsSet.getClaim("nonce").toString());
        assertEquals(state, claimsSet.getClaim("state").toString());
        assertEquals(authzRequestDto.getResponseUri(), claimsSet.getClaim("response_uri").toString());
        assertNull(claimsSet.getClaim("presentation_definition_uri"));

        verify(mockKeyManagementService, times(1)).getKeyPair();
    }

    @Test
    @DisplayName("Should throw JOSEException if KeyManagementService fails to provide key")
    void createAndSignAuthorizationRequestJwt_KeyServiceFails_ThrowsJOSEException() {
        String verifierDid = "did:inji:verifier-fail";
        AuthorizationRequestResponseDto authzRequestDto = new AuthorizationRequestResponseDto(
                "cId",
                "https://definition.example.com/pd-1",
                null,
                "test_nonce_abc",
                "resURL");
        String state = "error_state";

        when(mockKeyManagementService.getKeyPair()).thenThrow(new JWTCreationException());

        JWTCreationException thrown = assertThrows(JWTCreationException.class, () -> {
            jwtService.createAndSignAuthorizationRequestJwt(verifierDid, authzRequestDto, state);
        });

        assertEquals("Error while creating JWT. Please check the input and try again.", thrown.getMessage());
        verify(mockKeyManagementService, times(1)).getKeyPair();
    }
}