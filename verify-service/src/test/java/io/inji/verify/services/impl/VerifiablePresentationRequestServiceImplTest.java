package io.inji.verify.services.impl;

import io.inji.verify.config.RedisConfigProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jose.jwk.gen.OctetKeyPairGenerator;
import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.presentation.FormatDto;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.KeyManagementService;
import io.inji.verify.services.AuthorizationRequestCacheService;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class VerifiablePresentationRequestServiceImplTest {
    static VerifiablePresentationRequestServiceImpl service;
    static AuthorizationRequestCreateResponseRepository mockAuthorizationRequestCreateResponseRepository;
    static PresentationDefinitionRepository mockPresentationDefinitionRepository;
    static VPSubmissionRepository mockVPSubmissionRepository;
    static AuthorizationRequestCacheService mockCacheService;
    static KeyManagementService<OctetKeyPair> mockKeyManagementService;

    @BeforeAll
    public static void beforeAll() {
        mockPresentationDefinitionRepository = mock(PresentationDefinitionRepository.class);
        mockAuthorizationRequestCreateResponseRepository = mock(AuthorizationRequestCreateResponseRepository.class);
        mockVPSubmissionRepository = mock(VPSubmissionRepository.class);
        mockKeyManagementService = mock(KeyManagementService.class);
        mockCacheService = mock(AuthorizationRequestCacheService.class);
        RedisConfigProperties mockRedisConfig = mock(RedisConfigProperties.class);
        when(mockRedisConfig.isAuthRequestPersisted()).thenReturn(false);
        when(mockRedisConfig.isAuthRequestCacheEnabled()).thenReturn(false);
        service = new VerifiablePresentationRequestServiceImpl(
                mockPresentationDefinitionRepository,
                mockAuthorizationRequestCreateResponseRepository,
                mockVPSubmissionRepository,
                mockRedisConfig,
                mockCacheService,
                mockKeyManagementService
        );
    }

    @Test
    public void shouldCreateNewAuthorizationRequest() throws PresentationDefinitionNotFoundException {
        when(mockPresentationDefinitionRepository.save(any(PresentationDefinition.class))).thenReturn(null);
        when(mockAuthorizationRequestCreateResponseRepository.save(any(AuthorizationRequestCreateResponse.class))).thenReturn(null);

        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        FormatDto mockFormatDto = mock();
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "", "", mockFormatDto, mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id", "test_transaction_id", null, "", mockPresentationDefinitionDto);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertEquals("test_transaction_id", responseDto.getTransactionId());
        assertNotNull(responseDto.getRequestId());
        assertNotNull(responseDto.getAuthorizationDetails());
        assertTrue(responseDto.getExpiresAt() > Instant.now().toEpochMilli());
    }

    @Test
    public void shouldCreateAuthorizationRequestWithMissingTransactionId() throws PresentationDefinitionNotFoundException {

        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        FormatDto mockFormatDto = mock();
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "", "", mockFormatDto, mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id", null, null, "", mockPresentationDefinitionDto);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertTrue(responseDto.getTransactionId().startsWith(Constants.TRANSACTION_ID_PREFIX));
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForExistingRequest() {
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli() + 10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(java.util.Optional.of(mockResponse));
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.empty());

        VPRequestStatusDto vpRequestStatusDto = service.getCurrentRequestStatus("req_id");

        assertEquals(VPRequestStatus.ACTIVE, vpRequestStatusDto.getStatus());
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForNonexistentRequest() {
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.empty());
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli() + 10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(java.util.Optional.of(mockResponse));

        VPRequestStatusDto vpRequestStatusDto = service.getCurrentRequestStatus("nonexistent_id");

        assertNull(vpRequestStatusDto);
    }

    @Test
    void getStatus_requestIdNotFound_returnsNotFoundError() {
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(Optional.empty());

        DeferredResult<VPRequestStatusDto> result = service.getStatus("req_id");

        assertEquals(HttpStatus.NOT_FOUND, ((ResponseEntity<?>) Objects.requireNonNull(result.getResult())).getStatusCode());
    }

    @Test()
    void getStatus_requestExpired_returnsExpiredStatus() {
        service.defaultTimeout = 1000L;
        String requestId = "req_id";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli() - 10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));

        DeferredResult<VPRequestStatusDto> result = service.getStatus(requestId);

        assertEquals(VPRequestStatus.EXPIRED, ((VPRequestStatusDto) Objects.requireNonNull(result.getResult())).getStatus());
    }

    @Test
    @DisplayName("Should return JWT string when authorization request and details are valid")
    void getVPRequestJwt_ValidRequest_ReturnsJwtString() throws JOSEException {
        String requestId = "testRequestId123";
        String verifierDid = "did:example:verifier123";
        String expectedJwtHeader = "eyJ0eXAiOiJvYXV0aC1hdXRoei1yZXErand0IiwiYWxnIjoiRWREU0EifQ.";

        AuthorizationRequestResponseDto authzDetailsDto = new AuthorizationRequestResponseDto(verifierDid, null, null, null, null);

        AuthorizationRequestCreateResponse authzResponse = new AuthorizationRequestCreateResponse(requestId, null, authzDetailsDto, 0L);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(authzResponse));
        OctetKeyPair mockOKP = new OctetKeyPairGenerator(Curve.Ed25519).generate();

        when(mockKeyManagementService.getKeyPair()).thenReturn(mockOKP);

        String actualJwt = service.getVPRequestJwt(requestId);

        assertNotNull(actualJwt);
        assertTrue(actualJwt.startsWith(expectedJwtHeader));

        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findById(requestId);
    }

    @Test
    void getVPRequestJwt_NullAuthorizationDetails_ReturnsNull() {
        String requestId = "reqWithNullDetails";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(requestId, "tx", null, Instant.now().toEpochMilli() + 1000);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));

        String jwt = service.getVPRequestJwt(requestId);
        assertNull(jwt);
    }

    @Test
    void getVPRequestJwt_WithPresentationDefinitionUri_ReturnsJwt() throws Exception {
        String requestId = "reqWithUri";
        AuthorizationRequestResponseDto authzDto = new AuthorizationRequestResponseDto("did:example", "presentationUri", null, "nonce", "responseUri");
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(requestId, "tx", authzDto, Instant.now().toEpochMilli() + 1000);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));
        OctetKeyPair mockOKP = new OctetKeyPairGenerator(Curve.Ed25519).generate();
        when(mockKeyManagementService.getKeyPair()).thenReturn(mockOKP);

        String jwt = service.getVPRequestJwt(requestId);
        assertNotNull(jwt);
    }

    @Test
    void getVPRequestJwt_WithPresentationDefinition_ReturnsJwt() throws Exception {
        String requestId = "reqWithDefinition";
        VPDefinitionResponseDto vpDef = new VPDefinitionResponseDto("id", List.of(), "name", "purpose", null, List.of());
        AuthorizationRequestResponseDto authzDto = new AuthorizationRequestResponseDto("did:example", null, vpDef, "nonce", "responseUri");
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(requestId, "tx", authzDto, Instant.now().toEpochMilli() + 1000);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));
        OctetKeyPair mockOKP = new OctetKeyPairGenerator(Curve.Ed25519).generate();
        when(mockKeyManagementService.getKeyPair()).thenReturn(mockOKP);

        String jwt = service.getVPRequestJwt(requestId);
        assertNotNull(jwt);
    }

    @Test
    void getStatus_WithTimeout_InvokesListener() throws InterruptedException {
        service.defaultTimeout = 100L;
        String requestId = "timeoutReq";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(requestId, "tx", new AuthorizationRequestResponseDto("did:example", null, null, "nonce", "responseUri"), Instant.now().toEpochMilli() + 2000);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));

        DeferredResult<VPRequestStatusDto> result = service.getStatus(requestId);
        assertNotNull(result);
    }

}
