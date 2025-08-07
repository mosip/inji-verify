package io.inji.verify.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jose.util.JSONObjectUtils;
import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.client.ClientMetadataDto;
import io.inji.verify.exception.JWTCreationException;
import io.inji.verify.services.JwtService;
import com.nimbusds.jose.crypto.Ed25519Signer;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.inji.verify.services.KeyManagementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import static io.inji.verify.shared.Constants.VP_FORMATS;

@Service
@Slf4j
public class JwtServiceImpl implements JwtService {

    @Value("${inji.did.issuer.public.key.uri}")
    String issuerPublicKeyURI;

    private final KeyManagementService<OctetKeyPair> keyManagementService;

    public JwtServiceImpl(KeyManagementService<OctetKeyPair> keyManagementService) {
        this.keyManagementService = keyManagementService;
    }

    @Override
    public String createAndSignAuthorizationRequestJwt(String verifierDid, AuthorizationRequestResponseDto authorizationRequest, String state) {

        try {

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .issuer(verifierDid)
                    .issueTime(Date.from(Instant.now()))
                    .claim("client_id", verifierDid)
                    .jwtID(UUID.randomUUID().toString())
                    .claim("response_type", authorizationRequest.getResponseType())
                    .claim("response_mode", "direct_post")
                    .claim("nonce", authorizationRequest.getNonce())
                    .claim("state", state)
                    .claim("response_uri", authorizationRequest.getResponseUri())
                    .claim("client_metadata", new ClientMetadataDto(verifierDid,VP_FORMATS))
                    .build();
            if (authorizationRequest.getPresentationDefinitionUri() != null) {
                claimsSet = new JWTClaimsSet.Builder(claimsSet)
                        .claim("presentation_definition_uri", authorizationRequest.getPresentationDefinitionUri())
                        .build();
            } else if (authorizationRequest.getPresentationDefinition() != null) {
                String presentationDefinitionJson = new ObjectMapper().writeValueAsString(authorizationRequest.getPresentationDefinition());
                claimsSet = new JWTClaimsSet.Builder(claimsSet)
                        .claim("presentation_definition", JSONObjectUtils.parse(presentationDefinitionJson))
                        .build();
            }

            JWSHeader jwsHeader = new JWSHeader.Builder(JWSAlgorithm.EdDSA)
                    .type(new JOSEObjectType("oauth-authz-req+jwt"))
                    .keyID(issuerPublicKeyURI)
                    .build();
            SignedJWT signedJWT = new SignedJWT(jwsHeader, claimsSet);
            JWSSigner signer = new Ed25519Signer(keyManagementService.getKeyPair());

            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (ParseException | JOSEException | JsonProcessingException e) {
            log.error("Error generating JWT: {}", e.getMessage());
            throw new JWTCreationException();
        }
    }
}