package io.inji.verify.verifyservice.services;

import io.inji.verify.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.verifyservice.repository.VPSubmissionRepository;
import io.inji.verify.verifyservice.singletons.CredentialsVerifierSingleton;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.inji.verify.verifyservice.dto.submission.ResponseAcknowledgementDto;
import io.inji.verify.verifyservice.dto.submission.VPSubmissionDto;
import io.inji.verify.verifyservice.enums.SubmissionStatus;
import io.inji.verify.verifyservice.models.AuthorizationRequestCreateResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VerifiablePresentationSubmissionServiceImplTest {

    @Mock
    private AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;

    @Mock
    private VPSubmissionRepository vpSubmissionRepository;

    @Mock
    private CredentialsVerifierSingleton credentialsVerifierSingleton;

    @InjectMocks
    private VerifiablePresentationSubmissionServiceImpl service;

    @Test
    public void testSubmit_Success() throws Exception {
        CredentialsVerifier mockCredentialsVerifier = mock(CredentialsVerifier.class);
        when(credentialsVerifierSingleton.getInstance()).thenReturn(mockCredentialsVerifier);
        // Mock successful verification
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(new VerificationResult(true, "",""));

        // Mock repositories
        when(authorizationRequestCreateResponseRepository.findById(anyString())).thenReturn(java.util.Optional.of(new AuthorizationRequestCreateResponse()));

        // Create VPSubmissionDto with valid data
        VPSubmissionDto vpSubmissionDto = mock();

        // Call submit method
        ResponseAcknowledgementDto response = service.submit(vpSubmissionDto);

        // Assert response and repository interaction
        assertNotNull(response);
        verify(vpSubmissionRepository).save(argThat(submission -> submission.getSubmissionStatus() == SubmissionStatus.SUCCESS));
        verify(authorizationRequestCreateResponseRepository).findById(vpSubmissionDto.getState());
    }

    @Test
    public void testSubmit_VerificationFailure() throws Exception {
        // Mock verification failure
        CredentialsVerifier mockCredentialsVerifier = mock(CredentialsVerifier.class);
        when(credentialsVerifierSingleton.getInstance()).thenReturn(mockCredentialsVerifier);
        // Mock successful verification
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(new VerificationResult(false, "",""));

        // Mock repositories (similar to success test)

        // Create VPSubmissionDto with valid data
        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto("state", mock(), "presentationSubmission");

        // Call submit method
        ResponseAcknowledgementDto response = service.submit(vpSubmissionDto);

        // Assert response and repository interaction
        assertNotNull(response);
        verify(vpSubmissionRepository).save(argThat(submission -> submission.getSubmissionStatus() == SubmissionStatus.FAILED));
    }

    @Test
    public void testSubmit_Exception() throws Exception {
        CredentialsVerifier mockCredentialsVerifier = mock(CredentialsVerifier.class);
        when(credentialsVerifierSingleton.getInstance()).thenReturn(mockCredentialsVerifier);
        // Mock successful verification
        // Mock verification to throw an exception
        doThrow(new RuntimeException()).when(mockCredentialsVerifier).verify(anyString(), any(CredentialFormat.class));

        // Mock repositories (similar to success test)

        // Create VPSubmissionDto with valid data
        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto("state", mock(), "presentationSubmission");

        // Call submit method
        ResponseAcknowledgementDto response = service.submit(vpSubmissionDto);

        // Assert response and repository interaction
        assertNotNull(response);
        verify(vpSubmissionRepository).save(argThat(submission -> submission.getSubmissionStatus() == SubmissionStatus.FAILED));
    }

    // ... You can add additional test cases for getVPResult

}