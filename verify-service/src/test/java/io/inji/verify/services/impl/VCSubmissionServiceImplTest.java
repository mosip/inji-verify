package io.inji.verify.services.impl;

import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import io.inji.verify.models.VCSubmission;
import io.inji.verify.repository.VCSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.utils.Utils;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.CredentialVerificationSummary;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import io.inji.verify.dto.submission.VCSubmissionDto;

@ExtendWith(MockitoExtension.class)
public class VCSubmissionServiceImplTest {

    @Mock
    private VCSubmissionRepository vcSubmissionRepository;

    @Mock
    private CredentialsVerifier credentialsVerifier;

    @InjectMocks
    private VCSubmissionServiceImpl vcSubmissionService;

    private final String TEST_VC_STRING = "{\"vc\": \"someVerifiableCredential\"}";
    private final String TEST_TRANSACTION_ID = "txn-12345";

    @Test
    void submitVC_shouldSaveVCAndReturnResponseDto() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
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
        VCSubmissionDto submissionDto = new VCSubmissionDto(TEST_VC_STRING, TEST_TRANSACTION_ID);
        VCSubmission expectedVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.save(any(VCSubmission.class))).thenReturn(expectedVCSubmission);
        VCSubmissionResponseDto response = vcSubmissionService.submitVC(submissionDto);
        assertNotNull(response);
        assertEquals(TEST_TRANSACTION_ID, response.getTransactionId());
        verify(vcSubmissionRepository, times(1)).save(argThat(vc
                -> vc.getTransactionId().equals(TEST_TRANSACTION_ID)
                && vc.getVc().equals(TEST_VC_STRING)
        ));
    }

    @Test
    void getVcWithVerification_shouldReturnSuccessStatus_whenVerificationPasses() {
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(foundVCSubmission));

        CredentialVerificationSummary credentialVerificationSummary = mock(CredentialVerificationSummary.class);
        when(credentialsVerifier.verifyAndGetCredentialStatus(
                eq(TEST_VC_STRING),
                eq(CredentialFormat.LDP_VC),
                anyList())
        ).thenReturn(credentialVerificationSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(credentialVerificationSummary))
                    .thenReturn(VerificationStatus.SUCCESS);

            VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

            assertNotNull(resultDto);
            assertEquals(TEST_VC_STRING, resultDto.getVc());
            assertEquals(VerificationStatus.SUCCESS, resultDto.getVerificationStatus());

            verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
            verify(credentialsVerifier, times(1)).verifyAndGetCredentialStatus(
                    eq(TEST_VC_STRING),
                    eq(CredentialFormat.LDP_VC),
                    argThat(list -> list.contains(Constants.STATUS_PURPOSE_REVOKED))
            );
            utilsMock.verify(() -> Utils.getVcVerificationStatus(credentialVerificationSummary), times(1));
        }
    }

    @Test
    void getVcWithVerification_shouldReturnExpiredStatus_whenVerificationPassesButVCIsExpired() {
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID))
                .thenReturn(Optional.of(foundVCSubmission));

        CredentialVerificationSummary credentialVerificationSummary = mock(CredentialVerificationSummary.class);
        when(credentialsVerifier.verifyAndGetCredentialStatus(
                eq(TEST_VC_STRING),
                eq(CredentialFormat.LDP_VC),
                anyList())
        ).thenReturn(credentialVerificationSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(credentialVerificationSummary))
                    .thenReturn(VerificationStatus.EXPIRED);

            VCSubmissionVerificationStatusDto resultDto =
                    vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

            assertNotNull(resultDto);
            assertEquals(TEST_VC_STRING, resultDto.getVc());
            assertEquals(VerificationStatus.EXPIRED, resultDto.getVerificationStatus());

            verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
            verify(credentialsVerifier, times(1)).verifyAndGetCredentialStatus(
                    eq(TEST_VC_STRING),
                    eq(CredentialFormat.LDP_VC),
                    argThat(list -> list.contains(Constants.STATUS_PURPOSE_REVOKED))
            );
            utilsMock.verify(() -> Utils.getVcVerificationStatus(credentialVerificationSummary), times(1));
        }
    }

    @Test
    void getVcWithVerification_shouldReturnInvalidStatus_whenVerificationFails() {
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(foundVCSubmission));

        CredentialVerificationSummary credentialVerificationSummary = mock(CredentialVerificationSummary.class);
        when(credentialsVerifier.verifyAndGetCredentialStatus(
                eq(TEST_VC_STRING),
                eq(CredentialFormat.LDP_VC),
                anyList())
        ).thenReturn(credentialVerificationSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(credentialVerificationSummary))
                    .thenReturn(VerificationStatus.INVALID);

            VCSubmissionVerificationStatusDto resultDto =
                    vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

            assertNotNull(resultDto);
            assertEquals(TEST_VC_STRING, resultDto.getVc());
            assertEquals(VerificationStatus.INVALID, resultDto.getVerificationStatus());

            verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
            verify(credentialsVerifier, times(1)).verifyAndGetCredentialStatus(
                    eq(TEST_VC_STRING),
                    eq(CredentialFormat.LDP_VC),
                    argThat(list -> list.contains(Constants.STATUS_PURPOSE_REVOKED))
            );
            utilsMock.verify(() -> Utils.getVcVerificationStatus(credentialVerificationSummary), times(1));
        }
    }

    @Test
    void getVcWithVerification_shouldReturnNull_whenVCSubmissionNotFound() {
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.empty());

        VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        assertNull(resultDto);

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verifyNoInteractions(credentialsVerifier);
    }

    @Test
    void getVcWithVerification_shouldReturnRevokeStatus_whenVerificationPassesButVCIsRevoked() {
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(foundVCSubmission));

        CredentialVerificationSummary credentialVerificationSummary = mock(CredentialVerificationSummary.class);
        when(credentialsVerifier.verifyAndGetCredentialStatus(
                eq(TEST_VC_STRING),
                eq(CredentialFormat.LDP_VC),
                anyList())
        ).thenReturn(credentialVerificationSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(credentialVerificationSummary))
                    .thenReturn(VerificationStatus.REVOKED);

            VCSubmissionVerificationStatusDto resultDto = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

            assertNotNull(resultDto);
            assertEquals(TEST_VC_STRING, resultDto.getVc());
            assertEquals(VerificationStatus.REVOKED, resultDto.getVerificationStatus());

            verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
            verify(credentialsVerifier, times(1)).verifyAndGetCredentialStatus(
                    eq(TEST_VC_STRING),
                    eq(CredentialFormat.LDP_VC),
                    argThat(list -> list.contains(Constants.STATUS_PURPOSE_REVOKED))
            );
            utilsMock.verify(() -> Utils.getVcVerificationStatus(credentialVerificationSummary), times(1));
        }
    }
}