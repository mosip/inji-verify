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
import java.util.Base64;
import java.util.List;
import org.json.JSONTokener;

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
        List<VCResultDto> verificationResults = new ArrayList<>();

        try {
            Object vpTokenRaw = new JSONTokener(vpSubmission.getVpToken()).nextValue();
            List<JSONObject> vpTokens = new ArrayList<>();

            if (vpTokenRaw instanceof String) {
                String decodedJson = new String(Base64.getUrlDecoder().decode((String) vpTokenRaw));
                vpTokenRaw = new JSONTokener(decodedJson).nextValue();
            }

            if (vpTokenRaw instanceof JSONObject) {
                vpTokens.add((JSONObject) vpTokenRaw);
            } else if (vpTokenRaw instanceof JSONArray) {
                JSONArray array = (JSONArray) vpTokenRaw;
                for (int i = 0; i < array.length(); i++) {
                    Object item = array.get(i);

                    if (item instanceof String) {
                        String decodedJson = new String(Base64.getUrlDecoder().decode((String) item));
                        item = new JSONTokener(decodedJson).nextValue();
                    }

                    if (item instanceof JSONObject) {
                        vpTokens.add((JSONObject) item);
                    } else {
                        throw new IllegalArgumentException("Invalid item in vp_token array");
                    }
                }
            } else {
                throw new IllegalArgumentException("Invalid vp_token format");
            }

            for (JSONObject vpToken : vpTokens) {
                JSONObject vpProof = vpToken.getJSONObject(Constants.KEY_PROOF);
                String keyType = vpProof.getString(Constants.KEY_TYPE);
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
                JSONArray verifiableCredentials = vpToken.getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
                log.info("Processing VC verification");
                List<VCResultDto> vcResults = getVCVerificationResults(verifiableCredentials);
                verificationResults.addAll(vcResults);
            }
            log.info("Processing VP token matching");

            if (!isVPTokenMatching(vpSubmission, transactionId)) {
                throw new TokenMatchingFailedException();
            }
            boolean combinedVerificationStatus = true;
            for (VCResultDto verificationResult : verificationResults) {
                combinedVerificationStatus = combinedVerificationStatus && (verificationResult.getVerificationStatus() == VerificationStatus.SUCCESS);
            }
            if (!combinedVerificationStatus) {
                throw new VerificationFailedException();
            }
            log.info("VP submission processing done");
            return new VPTokenResultDto(transactionId, VPResultStatus.SUCCESS, verificationResults);
        } catch (Exception e) {
            log.error("Failed to verify VP submission", e);
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
            VerificationResult verificationResult = credentialsVerifier.verify(verifiableCredential.toString(), CredentialFormat.LDP_VC);
            VerificationStatus singleVCVerification = Utils.getVerificationStatus(verificationResult);
            verificationResults.add(new VCResultDto(verifiableCredential.toString(), singleVCVerification));
        }
        return verificationResults;
    }

    private boolean isVPTokenMatching(VPSubmission vpSubmission, String transactionId) {
        Object vpTokenRaw = new JSONTokener(vpSubmission.getVpToken()).nextValue();
        List<DescriptorMapDto> descriptorMap = vpSubmission.getPresentationSubmission().getDescriptorMap();
        AuthorizationRequestCreateResponse request = verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId);

        if (vpTokenRaw == null || request == null || descriptorMap == null || descriptorMap.isEmpty()) {
            log.info("Unable to perform token matching");
            return false;
        }

        log.info("VP token matching done");
        return true;
    }
}