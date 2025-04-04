package io.inji.verify.services.impl;


import io.inji.verify.dto.submission.DescriptorMapDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.enums.VerificationStatus;
import io.inji.verify.exception.TokenMatchingFailedException;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.exception.VerificationFailedException;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.dto.result.VCResultDto;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
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
    VPSubmissionRepository vpSubmissionRepository;

    @Autowired
    CredentialsVerifier credentialsVerifier;

    @Autowired
    VerifiablePresentationRequestServiceImpl verifiablePresentationRequestService;

    @Override
    public void submit(VPSubmissionDto vpSubmissionDto) {
        vpSubmissionRepository.save(new VPSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission()));
        verifiablePresentationRequestService.invokeVpRequestStatusListener(vpSubmissionDto.getState());
    }

    private VPTokenResultDto processSubmission(VPSubmission vpSubmission, String transactionId) {
        log.info("Processing VP submission");
        JSONObject vpProof = new JSONObject(vpSubmission.getVpToken()).getJSONObject(Constants.KEY_PROOF);
        String keyType = vpProof.getString(Constants.KEY_TYPE);
        List<VCResultDto> verificationResults = null;
        try {
            log.info("Processing VP verification");
            switch (keyType) {
                case Constants.RSA_SIGNATURE_2018:
                    VerificationUtils.verifyRsaSignature2018(vpProof);
                    break;
                case Constants.ED25519_SIGNATURE_2018:
                case Constants.ED25519_SIGNATURE_2020:
                    VerificationUtils.verifyEd25519Signature(vpProof);
                    break;
            }
            log.info("VP verification done");
            log.info("Processing VP token matching");
            if (!isVPTokenMatching(vpSubmission,transactionId)){
                throw new TokenMatchingFailedException();
            }
            log.info("Processing VC verification");
            JSONArray verifiableCredentials = new JSONObject(vpSubmission.getVpToken()).getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
            verificationResults = getVCVerificationResults(verifiableCredentials);
            boolean combinedVerificationStatus = true;
            for (VCResultDto verificationResult : verificationResults) {
                combinedVerificationStatus = combinedVerificationStatus && (verificationResult.getVerificationStatus() == VerificationStatus.SUCCESS);
            }
            if (!combinedVerificationStatus) {
                throw new VerificationFailedException();
            }
            log.info("VC verification done");
            log.info("VP submission processing done");
            return new VPTokenResultDto(transactionId, VPResultStatus.SUCCESS, verificationResults);
        } catch (Exception e) {
            log.error("Failed to verify", e);
            return new VPTokenResultDto(transactionId, VPResultStatus.FAILED, verificationResults);
        }
    }

    @Override
    public VPTokenResultDto getVPResult(List<String> requestIds, String transactionId) throws VPSubmissionNotFoundException {
        List<VPSubmission> vpSubmissions = vpSubmissionRepository.findAllById(requestIds);

        if (vpSubmissions.isEmpty()) {
            throw new VPSubmissionNotFoundException();
        }
        VPSubmission vpSubmission = vpSubmissions.getFirst();
        return processSubmission(vpSubmission, transactionId);
    }

    private List<VCResultDto> getVCVerificationResults(JSONArray verifiableCredentials) {
        List<VCResultDto> verificationResults = new ArrayList<>();
        for (Object verifiableCredential : verifiableCredentials) {
            JSONObject fullVerifiableCredential = new JSONObject((String) verifiableCredential).getJSONObject(Constants.KEY_VERIFIABLE_CREDENTIAL);
            JSONObject credential = fullVerifiableCredential.getJSONObject(Constants.KEY_CREDENTIAL);
            VerificationResult verificationResult = credentialsVerifier.verify(credential.toString(), CredentialFormat.LDP_VC);
            VerificationStatus singleVCVerification = Utils.getVerificationStatus(verificationResult);
            verificationResults.add(new VCResultDto(fullVerifiableCredential.toString(),singleVCVerification));
        }
        return verificationResults;
    }

    private boolean isVPTokenMatching(VPSubmission vpSubmission, String transactionId) {
        JSONArray verifiableCredentials = new JSONObject(vpSubmission.getVpToken()).getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
        List<DescriptorMapDto> descriptorMap = vpSubmission.getPresentationSubmission().getDescriptorMap();
        AuthorizationRequestCreateResponse request = verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId);

        if(verifiableCredentials.isEmpty() || request == null || descriptorMap == null || descriptorMap.isEmpty()){
            log.info("Unable to perform token matching");
            return false;
        }

        log.info("VP token matching done");
        return true;
    }
}