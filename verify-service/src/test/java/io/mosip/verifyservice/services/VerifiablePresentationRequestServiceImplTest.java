package io.mosip.verifyservice.services;

import io.mosip.verifycore.dto.authorizationRequest.VPRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.VPRequestResponseDto;
import io.mosip.verifycore.dto.presentation.InputDescriptorDto;
import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
import io.mosip.verifycore.dto.presentation.SubmissionRequirementDto;
import io.mosip.verifycore.enums.SubmissionState;
import io.mosip.verifycore.models.AuthorizationRequestCreateResponse;
import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifycore.shared.Constants;
import io.mosip.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.mosip.verifyservice.repository.PresentationDefinitionRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class VerifiablePresentationRequestServiceImplTest {
    static VerifiablePresentationRequestServiceImpl service;
    static AuthorizationRequestCreateResponseRepository mockAuthorizationRequestCreateResponseRepository;
    static PresentationDefinitionRepository mockPresentationDefinitionRepository;
    @BeforeAll
    public static void beforeAll(){
        mockPresentationDefinitionRepository = mock(PresentationDefinitionRepository.class);
        mockAuthorizationRequestCreateResponseRepository = mock(AuthorizationRequestCreateResponseRepository.class);
        service = new VerifiablePresentationRequestServiceImpl();
        service.presentationDefinitionRepository = mockPresentationDefinitionRepository;
        service.authorizationRequestCreateResponseRepository = mockAuthorizationRequestCreateResponseRepository;

    }
    @Test
    public void shouldCreateNewAuthorizationRequest() {

        when(mockPresentationDefinitionRepository.save(any(PresentationDefinition.class))).thenReturn(null);
        when(mockAuthorizationRequestCreateResponseRepository.save(any(AuthorizationRequestCreateResponse.class))).thenReturn(null);

        service.presentationDefinitionRepository = mockPresentationDefinitionRepository;
        service.authorizationRequestCreateResponseRepository = mockAuthorizationRequestCreateResponseRepository;

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
        AuthorizationRequestCreateResponse mockResponse = new AuthorizationRequestCreateResponse("req_id", "tx_id", null, 0, SubmissionState.PENDING);
        when(mockAuthorizationRequestCreateResponseRepository.findById("req_id")).thenReturn(java.util.Optional.of(mockResponse));

        SubmissionState state = service.getCurrentAuthorizationRequestStateFor("req_id");

        assertEquals(SubmissionState.PENDING, state);
    }

    @Test
    public void shouldGetCurrentAuthorizationRequestStateForNonexistentRequest() {
        when(mockAuthorizationRequestCreateResponseRepository.findById("nonexistent_id")).thenReturn(java.util.Optional.empty());

        SubmissionState state = service.getCurrentAuthorizationRequestStateFor("nonexistent_id");

        assertNull(state);
    }
}