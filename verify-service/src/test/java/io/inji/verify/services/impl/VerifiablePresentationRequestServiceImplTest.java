package io.inji.verify.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimbusds.jose.JOSEException;
import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.presentation.FormatDto;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.dto.presentation.JwtDto;
import io.inji.verify.dto.presentation.JwtVcDto;
import io.inji.verify.dto.presentation.LdpVcDto;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.JwtService;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class VerifiablePresentationRequestServiceImplTest {

    static VerifiablePresentationRequestServiceImpl service;
    static AuthorizationRequestCreateResponseRepository mockAuthorizationRequestCreateResponseRepository;
    static PresentationDefinitionRepository mockPresentationDefinitionRepository;
    static VPSubmissionRepository mockVPSubmissionRepository;
    static JwtService mockJwtService;

    @BeforeAll
    public static void beforeAll() {
        mockPresentationDefinitionRepository = mock(PresentationDefinitionRepository.class);
        mockAuthorizationRequestCreateResponseRepository = mock(AuthorizationRequestCreateResponseRepository.class);
        mockVPSubmissionRepository = mock(VPSubmissionRepository.class);
        mockJwtService = mock(JwtService.class);
        service = new VerifiablePresentationRequestServiceImpl(mockPresentationDefinitionRepository, mockAuthorizationRequestCreateResponseRepository, mockVPSubmissionRepository, mockJwtService);
    }

    @BeforeEach
    public void setUp() {
        reset(mockPresentationDefinitionRepository,
                mockAuthorizationRequestCreateResponseRepository,
                mockVPSubmissionRepository,
                mockJwtService);

        ReflectionTestUtils.setField(service, "defaultTimeout", 30000L);
        ReflectionTestUtils.setField(service, "vpSubmissionBaseUrl", "https://test.example.com");
    }

    @Test
    public void shouldCreateNewAuthorizationRequest() throws PresentationDefinitionNotFoundException {
        when(mockPresentationDefinitionRepository.save(any(PresentationDefinition.class))).thenReturn(null);
        when(mockAuthorizationRequestCreateResponseRepository.save(any(AuthorizationRequestCreateResponse.class))).thenReturn(null);

        List<InputDescriptorDto> mockInputDescriptorDtos = mock(List.class);
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock(List.class);
        FormatDto mockFormatDto = mock(FormatDto.class);
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
    @DisplayName("Should create authorization request with DID client ID")
    public void shouldCreateAuthorizationRequestWithDidClientId() throws PresentationDefinitionNotFoundException {
        List<InputDescriptorDto> mockInputDescriptorDtos = mock(List.class);
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock(List.class);
        FormatDto mockFormatDto = mock(FormatDto.class);
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "", "", mockFormatDto, mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("did:example:client123", "test_transaction_id", null, "", mockPresentationDefinitionDto);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertEquals("test_transaction_id", responseDto.getTransactionId());
        assertNotNull(responseDto.getRequestId());
        assertNull(responseDto.getAuthorizationDetails()); // Should be null for DID clients
        assertNotNull(responseDto.getRequestUri()); // Should have request URI for DID clients
        assertTrue(responseDto.getRequestUri().contains(Constants.VP_REQUEST_URI));
        assertTrue(responseDto.getExpiresAt() > Instant.now().toEpochMilli());
    }

    @Test
    @DisplayName("Should create authorization request with presentation definition ID")
    public void shouldCreateAuthorizationRequestWithPresentationDefinitionId() throws PresentationDefinitionNotFoundException {
        String presentationDefId = "test_presentation_def_id";
        List<InputDescriptorDto> mockInputDescriptorDtos = List.of();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = List.of();

        JwtDto mockJwtDto = mock(JwtDto.class);
        JwtVcDto mockJwtVcDto = mock(JwtVcDto.class);
        LdpVcDto mockLdpVcDto = mock(LdpVcDto.class);
        FormatDto mockFormatDto = new FormatDto(mockJwtDto, mockJwtVcDto, mockLdpVcDto);

        PresentationDefinition mockPresentationDef = mock(PresentationDefinition.class);
        when(mockPresentationDef.getId()).thenReturn(presentationDefId);
        when(mockPresentationDef.getInputDescriptors()).thenReturn(mockInputDescriptorDtos);
        when(mockPresentationDef.getName()).thenReturn("Test Name");
        when(mockPresentationDef.getPurpose()).thenReturn("Test Purpose");
        when(mockPresentationDef.getFormat()).thenReturn(mockFormatDto);
        when(mockPresentationDef.getSubmissionRequirements()).thenReturn(mockSubmissionRequirementDtos);
        when(mockPresentationDef.getURL()).thenReturn("https://example.com/presentation-def");

        when(mockPresentationDefinitionRepository.findById(presentationDefId)).thenReturn(Optional.of(mockPresentationDef));
        when(mockAuthorizationRequestCreateResponseRepository.save(any(AuthorizationRequestCreateResponse.class))).thenReturn(null);

        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id", "test_transaction_id", presentationDefId, "", null);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertEquals("test_transaction_id", responseDto.getTransactionId());
        assertNotNull(responseDto.getRequestId());
        assertNotNull(responseDto.getAuthorizationDetails());
        assertEquals("https://example.com/presentation-def", responseDto.getAuthorizationDetails().getPresentationDefinitionUri());
        assertNotNull(responseDto.getAuthorizationDetails().getPresentationDefinition());
        assertTrue(responseDto.getExpiresAt() > Instant.now().toEpochMilli());

        verify(mockPresentationDefinitionRepository).findById(presentationDefId);
    }

    @Test
    @DisplayName("Should throw exception when presentation definition ID not found")
    public void shouldThrowExceptionWhenPresentationDefinitionIdNotFound() {
        String presentationDefId = "non_existent_id";

        when(mockPresentationDefinitionRepository.findById(presentationDefId)).thenReturn(Optional.empty());

        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id", "test_transaction_id", presentationDefId, "", null);

        assertThrows(PresentationDefinitionNotFoundException.class, () -> {
            service.createAuthorizationRequest(vpRequestCreateDto);
        });

        verify(mockPresentationDefinitionRepository).findById(presentationDefId);
    }

    @Test
    public void shouldCreateAuthorizationRequestWithMissingTransactionId() throws PresentationDefinitionNotFoundException {
        List<InputDescriptorDto> mockInputDescriptorDtos = mock(List.class);
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock(List.class);
        FormatDto mockFormatDto = mock(FormatDto.class);
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "", "", mockFormatDto, mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id", null, null, "", mockPresentationDefinitionDto);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertTrue(responseDto.getTransactionId().startsWith(Constants.TRANSACTION_ID_PREFIX));
    }

    @Test
    @DisplayName("Should create authorization request with custom nonce")
    public void shouldCreateAuthorizationRequestWithCustomNonce() throws PresentationDefinitionNotFoundException {
        List<InputDescriptorDto> mockInputDescriptorDtos = mock(List.class);
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock(List.class);
        FormatDto mockFormatDto = mock(FormatDto.class);
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "", "", mockFormatDto, mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id", "test_transaction_id", null, "custom_nonce_123", mockPresentationDefinitionDto);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertEquals("test_transaction_id", responseDto.getTransactionId());
        assertEquals("custom_nonce_123", responseDto.getAuthorizationDetails().getNonce());
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
        when(mockVPSubmissionRepository.findById("nonexistent_id")).thenReturn(Optional.empty());
        when(mockAuthorizationRequestCreateResponseRepository.findById("nonexistent_id")).thenReturn(Optional.empty());

        VPRequestStatusDto vpRequestStatusDto = service.getCurrentRequestStatus("nonexistent_id");

        assertNull(vpRequestStatusDto);
    }

    @Test
    @DisplayName("Should return VP_SUBMITTED status for an existing submission")
    public void shouldGetCurrentAuthorizationRequestStateForVPSubmittedRequest() {
        VPSubmission mockSubmission = mock(VPSubmission.class);
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.of(mockSubmission));

        VPRequestStatusDto vpRequestStatusDto = service.getCurrentRequestStatus("req_id");

        assertEquals(VPRequestStatus.VP_SUBMITTED, vpRequestStatusDto.getStatus());
        verify(mockVPSubmissionRepository, atLeastOnce()).findById("req_id");
    }

    @Test
    @DisplayName("Should return EXPIRED status for an expired request")
    void shouldGetCurrentAuthorizationRequestStateForExpiredRequest() {
        String requestId = "req_id";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(requestId, "tx_id", null, Instant.now().toEpochMilli() - 10000);

        when(mockVPSubmissionRepository.findById(requestId)).thenReturn(Optional.empty());
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));

        VPRequestStatusDto status = service.getCurrentRequestStatus(requestId);

        assertNotNull(status);
        assertEquals(VPRequestStatus.EXPIRED, status.getStatus());
    }

    @Test
    @DisplayName("Should get latest request IDs for transaction")
    public void shouldGetLatestRequestIdForTransaction() {
        String transactionId = "tx_request_ids_test";
        List<AuthorizationRequestCreateResponse> responses = List.of(
                new AuthorizationRequestCreateResponse("req_1_ids_test", transactionId, null, Instant.now().toEpochMilli() + 1000),
                new AuthorizationRequestCreateResponse("req_2_ids_test", transactionId, null, Instant.now().toEpochMilli() + 2000)
        );

        when(mockAuthorizationRequestCreateResponseRepository.findAllByTransactionIdOrderByExpiresAtDesc(transactionId))
                .thenReturn(responses);

        List<String> requestIds = service.getLatestRequestIdFor(transactionId);

        assertEquals(2, requestIds.size());
        assertEquals("req_1_ids_test", requestIds.get(0));
        assertEquals("req_2_ids_test", requestIds.get(1));

        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findAllByTransactionIdOrderByExpiresAtDesc(transactionId);
    }

    @Test
    @DisplayName("Should get latest authorization request for transaction")
    public void shouldGetLatestAuthorizationRequestForTransaction() {
        String transactionId = "tx_latest_auth_req_test";
        String requestId = "req_latest_auth_req_test";

        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(requestId, transactionId, null, Instant.now().toEpochMilli());
        List<AuthorizationRequestCreateResponse> responses = List.of(response);

        when(mockAuthorizationRequestCreateResponseRepository.findAllByTransactionIdOrderByExpiresAtDesc(transactionId))
                .thenReturn(responses);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(response));

        AuthorizationRequestCreateResponse result = service.getLatestAuthorizationRequestFor(transactionId);

        assertNotNull(result);
        assertEquals(requestId, result.getRequestId());
        assertEquals(transactionId, result.getTransactionId());

        verify(mockAuthorizationRequestCreateResponseRepository, atLeastOnce()).findAllByTransactionIdOrderByExpiresAtDesc(transactionId);
        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findById(requestId);
    }

    @Test
    @DisplayName("Should return null when no requests found for transaction")
    public void shouldReturnNullWhenNoRequestsFoundForTransaction() {
        String transactionId = "tx_nonexistent";

        when(mockAuthorizationRequestCreateResponseRepository.findAllByTransactionIdOrderByExpiresAtDesc(transactionId))
                .thenReturn(List.of());

        AuthorizationRequestCreateResponse result = service.getLatestAuthorizationRequestFor(transactionId);

        assertNull(result);
    }

    @Test
    @DisplayName("Should invoke VP request status listener")
    public void shouldInvokeVpRequestStatusListener() {
        String requestId = "req_123";
        DeferredResult<VPRequestStatusDto> mockDeferredResult = mock(DeferredResult.class);

        service.vpRequestStatusListeners.put(requestId, mockDeferredResult);

        service.invokeVpRequestStatusListener(requestId);

        verify(mockDeferredResult).setResult(any(VPRequestStatusDto.class));
        assertFalse(service.vpRequestStatusListeners.containsKey(requestId));
    }

    @Test
    @DisplayName("Should handle invoke VP request status listener for non-existent request")
    public void shouldHandleInvokeVpRequestStatusListenerForNonExistentRequest() {
        String requestId = "req_nonexistent";

        assertDoesNotThrow(() -> service.invokeVpRequestStatusListener(requestId));
    }

    @Test
    @DisplayName("Should get status with deferred result for valid request")
    public void shouldGetStatusWithDeferredResultForValidRequest() {
        String requestId = "req_123";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(
                requestId, "tx_id", null, Instant.now().toEpochMilli() + 60000);

        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(response));
        when(mockVPSubmissionRepository.findById(requestId)).thenReturn(Optional.empty());

        DeferredResult<VPRequestStatusDto> result = service.getStatus(requestId);

        assertNotNull(result);
        assertNull(result.getResult()); // Should be null as it's waiting for async response
    }

    @Test
    @DisplayName("Should get status with timeout less than default timeout")
    public void shouldGetStatusWithTimeoutLessThanDefaultTimeout() {
        String requestId = "req_123";
        long shortExpiry = Instant.now().toEpochMilli() + 5000; // 5 seconds from now
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(
                requestId, "tx_id", null, shortExpiry);

        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(response));
        when(mockVPSubmissionRepository.findById(requestId)).thenReturn(Optional.empty());

        DeferredResult<VPRequestStatusDto> result = service.getStatus(requestId);

        assertNotNull(result);
    }

    @Test
    @DisplayName("Should return expired status immediately for expired request")
    public void shouldReturnExpiredStatusImmediatelyForExpiredRequest() {
        String requestId = "req_expired";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(
                requestId, "tx_id", null, Instant.now().toEpochMilli() - 1000);

        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(response));
        when(mockVPSubmissionRepository.findById(requestId)).thenReturn(Optional.empty());

        DeferredResult<VPRequestStatusDto> result = service.getStatus(requestId);

        assertNotNull(result);
        assertNotNull(result.getResult());
        VPRequestStatusDto statusDto = (VPRequestStatusDto) result.getResult();
        assertEquals(VPRequestStatus.EXPIRED, statusDto.getStatus());
    }

    @Test
    void getStatus_requestIdNotFound_returnsNotFoundError() {
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(Optional.empty());

        DeferredResult<VPRequestStatusDto> result = service.getStatus("req_id");

        assertEquals(HttpStatus.NOT_FOUND, ((ResponseEntity) result.getResult()).getStatusCode());
    }

    @Test
    @DisplayName("Should return JWT string when authorization request and details are valid")
    void getVPRequestJwt_ValidRequest_ReturnsJwtString() throws JOSEException, JsonProcessingException {
        String requestId = "testRequestId123";
        String verifierDid = "did:example:verifier123";
        String expectedJwt = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature";

        AuthorizationRequestResponseDto authzDetailsDto = new AuthorizationRequestResponseDto(verifierDid, null, null, null, null);
        AuthorizationRequestCreateResponse authzResponse = new AuthorizationRequestCreateResponse(requestId, null, authzDetailsDto, 0L);

        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(authzResponse));
        when(mockJwtService.createAndSignAuthorizationRequestJwt(eq(verifierDid), eq(authzDetailsDto), eq(requestId)))
                .thenReturn(expectedJwt);

        String actualJwt = service.getVPRequestJwt(requestId);

        assertNotNull(actualJwt);
        assertEquals(expectedJwt, actualJwt);
        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findById(requestId);
        verify(mockJwtService, times(1)).createAndSignAuthorizationRequestJwt(eq(verifierDid), eq(authzDetailsDto), eq(requestId));
    }

    @Test
    @DisplayName("Should handle JWT service exception in getVPRequestJwt")
    public void shouldHandleJwtServiceExceptionInGetVPRequestJwt() throws JOSEException, JsonProcessingException {
        String requestId = "testRequestId123";
        String verifierDid = "did:example:verifier123";

        AuthorizationRequestResponseDto authzDetailsDto = new AuthorizationRequestResponseDto(verifierDid, null, null, null, null);
        AuthorizationRequestCreateResponse authzResponse = new AuthorizationRequestCreateResponse(requestId, null, authzDetailsDto, 0L);

        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(authzResponse));

        when(mockJwtService.createAndSignAuthorizationRequestJwt(eq(verifierDid), eq(authzDetailsDto), eq(requestId)))
                .thenThrow(new RuntimeException("JWT creation failed"));

        assertThrows(RuntimeException.class, () -> {
            service.getVPRequestJwt(requestId);
        });

        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findById(requestId);
        verify(mockJwtService, times(1)).createAndSignAuthorizationRequestJwt(eq(verifierDid), eq(authzDetailsDto), eq(requestId));
    }

    @Test
    @DisplayName("Should handle JsonProcessingException in getVPRequestJwt")
    public void shouldHandleJsonProcessingExceptionInGetVPRequestJwt() throws JOSEException, JsonProcessingException {
        String requestId = "testRequestId123";
        String verifierDid = "did:example:verifier123";

        AuthorizationRequestResponseDto authzDetailsDto = new AuthorizationRequestResponseDto(verifierDid, null, null, null, null);
        AuthorizationRequestCreateResponse authzResponse = new AuthorizationRequestCreateResponse(requestId, null, authzDetailsDto, 0L);

        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(authzResponse));

        when(mockJwtService.createAndSignAuthorizationRequestJwt(eq(verifierDid), eq(authzDetailsDto), eq(requestId)))
                .thenThrow(new RuntimeException("JSON processing failed"));

        assertThrows(RuntimeException.class, () -> {
            service.getVPRequestJwt(requestId);
        });

        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findById(requestId);
        verify(mockJwtService, times(1)).createAndSignAuthorizationRequestJwt(eq(verifierDid), eq(authzDetailsDto), eq(requestId));
    }

}
