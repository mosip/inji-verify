package io.inji.verify.services.impl;

import io.inji.verify.config.RedisConfigProperties;
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
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.AuthorizationRequestCacheService;
import io.inji.verify.services.JwtService;
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
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class VerifiablePresentationRequestServiceImplTest {
    static VerifiablePresentationRequestServiceImpl service;
    static AuthorizationRequestCreateResponseRepository mockAuthorizationRequestCreateResponseRepository;
    static PresentationDefinitionRepository mockPresentationDefinitionRepository;
    static VPSubmissionRepository mockVPSubmissionRepository;
    static JwtService mockJwtService;
    static AuthorizationRequestCacheService mockCacheService;

    @BeforeAll
    public static void beforeAll() {
        mockPresentationDefinitionRepository = mock(PresentationDefinitionRepository.class);
        mockAuthorizationRequestCreateResponseRepository = mock(AuthorizationRequestCreateResponseRepository.class);
        mockVPSubmissionRepository = mock(VPSubmissionRepository.class);
        RedisConfigProperties mockRedisConfig = mock(RedisConfigProperties.class);
        when(mockRedisConfig.isAuthRequestPersisted()).thenReturn(false);
        when(mockRedisConfig.isAuthRequestCacheEnabled()).thenReturn(false);
        mockJwtService = mock(JwtService.class);
        mockCacheService = mock(AuthorizationRequestCacheService.class);

        service = new VerifiablePresentationRequestServiceImpl(
                mockPresentationDefinitionRepository,
                mockAuthorizationRequestCreateResponseRepository,
                mockVPSubmissionRepository,
                mockRedisConfig,
                mockJwtService,
                mockCacheService
        );
    }

    @Test
    public void shouldCreateNewAuthorizationRequest() throws PresentationDefinitionNotFoundException {
        when(mockPresentationDefinitionRepository.save(any(PresentationDefinition.class))).thenReturn(null);
        when(mockAuthorizationRequestCreateResponseRepository.save(any(AuthorizationRequestCreateResponse.class))).thenReturn(null);

        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        FormatDto mockFormatDto = mock();
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "","",mockFormatDto,mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id","test_transaction_id",null,"",mockPresentationDefinitionDto);


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
        VPDefinitionResponseDto mockPresentationDefinitionDto = new VPDefinitionResponseDto("test_id", mockInputDescriptorDtos, "","",mockFormatDto,mockSubmissionRequirementDtos);
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto("test_client_id",null,null,"",mockPresentationDefinitionDto);

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertTrue(responseDto.getTransactionId().startsWith(Constants.TRANSACTION_ID_PREFIX));
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForExistingRequest() {
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli()+10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(java.util.Optional.of(mockResponse));
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.empty());

        VPRequestStatusDto vpRequestStatusDto = service.getCurrentRequestStatus("req_id");

        assertEquals(VPRequestStatus.ACTIVE, vpRequestStatusDto.getStatus());
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForNonexistentRequest() {
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.empty());
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli()+10000);
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
        service.defaultTimeout =1000L;
        String requestId = "req_id";
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli()-10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId)).thenReturn(Optional.of(response));


        DeferredResult<VPRequestStatusDto> result = service.getStatus(requestId);

        assertEquals(VPRequestStatus.EXPIRED, ((VPRequestStatusDto) Objects.requireNonNull(result.getResult())).getStatus());
    }

    @Test
    @DisplayName("Should return JWT string when authorization request and details are valid")
    void getVPRequestJwt_ValidRequest_ReturnsJwtString() throws JOSEException, JsonProcessingException {
        String requestId = "testRequestId123";
        String verifierDid = "did:example:verifier123";
        String expectedJwt = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature";

        AuthorizationRequestResponseDto authzDetailsDto =
                new AuthorizationRequestResponseDto(verifierDid,null,null,
                        null,null);

        AuthorizationRequestCreateResponse authzResponse = new AuthorizationRequestCreateResponse(requestId,null,authzDetailsDto,0L);
        when(mockAuthorizationRequestCreateResponseRepository.findById(requestId))
                .thenReturn(Optional.of(authzResponse));

        when(mockJwtService.createAndSignAuthorizationRequestJwt(
                eq(verifierDid), eq(authzDetailsDto), eq(requestId)))
                .thenReturn(expectedJwt);

        String actualJwt = service.getVPRequestJwt(requestId);

        assertNotNull(actualJwt);
        assertEquals(expectedJwt, actualJwt);

        verify(mockAuthorizationRequestCreateResponseRepository, times(1)).findById(requestId);
        verify(mockJwtService, times(1)).createAndSignAuthorizationRequestJwt(
                eq(verifierDid), eq(authzDetailsDto), eq(requestId));
    }

}