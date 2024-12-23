package io.inji.verify.services;

import io.inji.verify.dto.authorizationrequest.StatusDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.enums.SubmissionState;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class VerifiablePresentationRequestServiceImplTest {
    static VerifiablePresentationRequestServiceImpl service;
    static AuthorizationRequestCreateResponseRepository mockAuthorizationRequestCreateResponseRepository;
    static PresentationDefinitionRepository mockPresentationDefinitionRepository;
    static VPSubmissionRepository mockVPSubmissionRepository;
    @BeforeAll
    public static void beforeAll(){
        mockPresentationDefinitionRepository = mock(PresentationDefinitionRepository.class);
        mockAuthorizationRequestCreateResponseRepository = mock(AuthorizationRequestCreateResponseRepository.class);
        mockVPSubmissionRepository = mock(VPSubmissionRepository.class);
        service = new VerifiablePresentationRequestServiceImpl();
        service.presentationDefinitionRepository = mockPresentationDefinitionRepository;
        service.authorizationRequestCreateResponseRepository = mockAuthorizationRequestCreateResponseRepository;
        service.vpSubmissionRepository = mockVPSubmissionRepository;

    }
    @Test
    public void shouldCreateNewAuthorizationRequest() {
        when(mockPresentationDefinitionRepository.save(any(PresentationDefinition.class))).thenReturn(null);
        when(mockAuthorizationRequestCreateResponseRepository.save(any(AuthorizationRequestCreateResponse.class))).thenReturn(null);

        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto();
        vpRequestCreateDto.setTransactionId("test_transaction_id");
        vpRequestCreateDto.setClientId("test_client_id");
        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        vpRequestCreateDto.setPresentationDefinition(new PresentationDefinitionDto("test_id", mockInputDescriptorDtos, mockSubmissionRequirementDtos));


        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertEquals("test_transaction_id", responseDto.getTransactionId());
        assertNotNull(responseDto.getRequestId());
        assertNotNull(responseDto.getAuthorizationDetails());
        assertTrue(responseDto.getExpiresAt() > Instant.now().toEpochMilli());
    }
    @Test
    public void shouldCreateAuthorizationRequestWithMissingTransactionId() {
        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto();
        vpRequestCreateDto.setClientId("test_client_id");
        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        vpRequestCreateDto.setPresentationDefinition(new PresentationDefinitionDto("test_id", mockInputDescriptorDtos, mockSubmissionRequirementDtos));

        VPRequestResponseDto responseDto = service.createAuthorizationRequest(vpRequestCreateDto);

        assertNotNull(responseDto);
        assertTrue(responseDto.getTransactionId().startsWith(Constants.TRANSACTION_ID_PREFIX));
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForExistingRequest() {
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli()+10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(java.util.Optional.of(mockResponse));
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.empty());

        StatusDto state = service.getCurrentRequestState("req_id");

        assertEquals(SubmissionState.PENDING, state.getStatus());
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForNonexistentRequest() {
        when(mockVPSubmissionRepository.findById("req_id")).thenReturn(Optional.empty());
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, Instant.now().toEpochMilli()+10000);
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(java.util.Optional.of(mockResponse));


        StatusDto state = service.getCurrentRequestState("nonexistent_id");

        assertNull(state);
    }
}