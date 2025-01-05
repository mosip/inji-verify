package io.inji.verify.services;


import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPSubmissionResponseDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.enums.VerificationStatus;
import io.inji.verify.exception.VerificationFailedException;
import io.inji.verify.models.VCResult;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.spi.VerifiablePresentationSubmissionService;
import io.inji.verify.utils.Utils;
import io.inji.verify.utils.VerificationUtils;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class VerifiablePresentationSubmissionServiceImpl implements VerifiablePresentationSubmissionService {

    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VPSubmissionRepository vpSubmissionRepository;

    @Autowired
    CredentialsVerifier credentialsVerifier;

    @Override
    public VPSubmissionResponseDto submit(VPSubmissionDto vpSubmissionDto) {
        vpSubmissionRepository.save(new VPSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission()));
        return new VPSubmissionResponseDto("", "", "");

    }

    private VPTokenResultDto processSubmission(VPSubmission vpSubmission, String transactionId) {
        JSONObject vpProof = new JSONObject(vpSubmission.getVpToken()).getJSONObject(Constants.KEY_PROOF);
        String keyType = vpProof.getString(Constants.KEY_TYPE);
        List<VCResult> verificationResults = null;
        try {
            switch (keyType) {
                case Constants.RSA_SIGNATURE_2018:
                    VerificationUtils.verifyRsaSignature2018(vpProof);
                    break;
                case Constants.ED25519_SIGNATURE_2018:
                case Constants.ED25519_SIGNATURE_2020:
                    VerificationUtils.verifyEd25519Signature(vpProof);
                    break;
            }

            JSONArray verifiableCredentials = new JSONObject(vpSubmission.getVpToken()).getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
            verificationResults = getVCVerificationResults(verifiableCredentials);
            boolean combinedVerificationStatus = true;
            for (VCResult verificationResult : verificationResults) {
                combinedVerificationStatus = combinedVerificationStatus && (verificationResult.getVerificationStatus() == VerificationStatus.SUCCESS);
            }
            if (!combinedVerificationStatus) {
                throw new VerificationFailedException();
            }
            return new VPTokenResultDto(transactionId, VPResultStatus.SUCCESS, verificationResults,null,null);
        } catch (Exception e) {
            log.error("Failed to verify",e);
            return new VPTokenResultDto(transactionId, VPResultStatus.FAILED, verificationResults,null,null);
        }
    }

    @Override
    public VPTokenResultDto getVPResult(List<String> requestIds, String transactionId) {
        VPSubmission vpSubmission = vpSubmissionRepository.findAllById(requestIds).getFirst();

        if (vpSubmission == null){
            return null;
        }
        return processSubmission(vpSubmission,transactionId);
    }

    private List<VCResult> getVCVerificationResults(JSONArray verifiableCredentials) {
        List<VCResult> verificationResults = new ArrayList<>();
        for (Object verifiableCredential : verifiableCredentials) {
            JSONObject fullVerifiableCredential = new JSONObject((String) verifiableCredential).getJSONObject(Constants.KEY_VERIFIABLE_CREDENTIAL);
            JSONObject credential = fullVerifiableCredential.getJSONObject(Constants.KEY_CREDENTIAL);
            VerificationResult verificationResult = credentialsVerifier.verify(credential.toString(), CredentialFormat.LDP_VC);
            VerificationStatus singleVCVerification = Utils.getVerificationStatus(verificationResult);
            verificationResults.add(new VCResult(fullVerifiableCredential.toString(),singleVCVerification));
        }
        return verificationResults;
    }
}

