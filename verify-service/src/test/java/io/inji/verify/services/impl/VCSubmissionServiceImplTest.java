package io.inji.verify.services.impl;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.submission.VCSubmissionDto;
import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import io.inji.verify.models.VCSubmission;
import io.inji.verify.repository.VCSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.utils.Utils;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VCSubmissionServiceImplTest {

    @Mock
    private VCSubmissionRepository vcSubmissionRepository;

    @Mock
    private CredentialsVerifier credentialsVerifier;

    @Mock
    private RedisConfigProperties redisConfigProperties;

    @InjectMocks
    private VCSubmissionServiceImpl vcSubmissionService;

    private final String TEST_VC_STRING = "{\"vc\": \"someVerifiableCredential\"}";
    private final String TEST_TRANSACTION_ID = "txn-12345";

    @Test
    void submitVC_shouldSaveVCAndReturnResponseDto() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            when(redisConfigProperties.isVcSubmissionPersisted()).thenReturn(true);
            mockedUtils.when(() -> Utils.generateID(Constants.TRANSACTION_ID_PREFIX))
                    .thenReturn(TEST_TRANSACTION_ID);

            VCSubmissionDto submissionDto = new VCSubmissionDto(TEST_VC_STRING, null);
            VCSubmission expectedVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
            when(vcSubmissionRepository.save(any(VCSubmission.class))).thenReturn(expectedVCSubmission);

            VCSubmissionResponseDto response = vcSubmissionService.submitVC(submissionDto);

            assertNotNull(response);
            assertEquals(TEST_TRANSACTION_ID, response.getTransactionId());

            verify(vcSubmissionRepository, times(1)).save(argThat(vc ->
                    vc.getTransactionId().equals(TEST_TRANSACTION_ID) &&
                            vc.getVc().equals(TEST_VC_STRING)
            ));
        }
    }

    @Test
    void submitVC_shouldUseProvidedTransactionId() {
        when(redisConfigProperties.isVcSubmissionPersisted()).thenReturn(true);
        VCSubmissionDto submissionDto = new VCSubmissionDto(TEST_VC_STRING, TEST_TRANSACTION_ID);
        VCSubmission expectedVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.save(any(VCSubmission.class))).thenReturn(expectedVCSubmission);
        
        VCSubmissionResponseDto response = vcSubmissionService.submitVC(submissionDto);
        
        assertNotNull(response);
        assertEquals(TEST_TRANSACTION_ID, response.getTransactionId());
        verify(vcSubmissionRepository, times(1)).save(argThat(vc ->
                vc.getTransactionId().equals(TEST_TRANSACTION_ID) &&
                        vc.getVc().equals(TEST_VC_STRING)
        ));
    }

    @Test
    void getVcWithVerification_shouldReturnSuccessStatus_whenVerificationPasses() {
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(false);
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(foundVCSubmission));

        VerificationResult successResult = mock(VerificationResult.class);
        when(successResult.getVerificationStatus()).thenReturn(true);
        when(successResult.getVerificationErrorCode()).thenReturn("");

        when(credentialsVerifier.verify(TEST_VC_STRING, CredentialFormat.LDP_VC))
                .thenReturn(successResult);

        VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        assertNotNull(resultDto);
        assertEquals(TEST_VC_STRING, resultDto.getVc());
        assertEquals(VerificationStatus.SUCCESS, resultDto.getVerificationStatus());

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verify(credentialsVerifier, times(1)).verify(TEST_VC_STRING, CredentialFormat.LDP_VC);
    }

    @Test
    void getVcWithVerification_shouldReturnExpiredStatus_whenVerificationPassesButVCIsExpired() {
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(false);
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(foundVCSubmission));

        VerificationResult expiredResult = mock(VerificationResult.class);
        when(expiredResult.getVerificationStatus()).thenReturn(true);
        when(expiredResult.getVerificationErrorCode()).thenReturn(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED);

        when(credentialsVerifier.verify(TEST_VC_STRING, CredentialFormat.LDP_VC))
                .thenReturn(expiredResult);

        VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        assertNotNull(resultDto);
        assertEquals(TEST_VC_STRING, resultDto.getVc());
        assertEquals(VerificationStatus.EXPIRED, resultDto.getVerificationStatus());

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verify(credentialsVerifier, times(1)).verify(TEST_VC_STRING, CredentialFormat.LDP_VC);
    }

    @Test
    void getVcWithVerification_shouldReturnInvalidStatus_whenVerificationFails() {
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(false);
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(foundVCSubmission));

        VerificationResult failedResult = mock(VerificationResult.class);
        when(failedResult.getVerificationStatus()).thenReturn(false);

        when(credentialsVerifier.verify(TEST_VC_STRING, CredentialFormat.LDP_VC))
                .thenReturn(failedResult);

        VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        assertNotNull(resultDto);
        assertEquals(TEST_VC_STRING, resultDto.getVc());
        assertEquals(VerificationStatus.INVALID, resultDto.getVerificationStatus());

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verify(credentialsVerifier, times(1)).verify(TEST_VC_STRING, CredentialFormat.LDP_VC);
    }

    @Test
    void getVcWithVerification_shouldReturnNull_whenVCSubmissionNotFound() {
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(false);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.empty());

        VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        assertNull(resultDto);

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verifyNoInteractions(credentialsVerifier);
    }
}