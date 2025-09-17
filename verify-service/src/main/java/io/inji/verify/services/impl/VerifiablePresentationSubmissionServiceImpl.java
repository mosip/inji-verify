package io.inji.verify.services.impl;

import io.inji.verify.dto.submission.DescriptorMapDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.exception.TokenMatchingFailedException;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.dto.result.VCResultDto;
import io.inji.verify.exception.VpSubmissionError;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.PresentationVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.PresentationVerificationResult;
import io.mosip.vercred.vcverifier.data.VPVerificationStatus;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import org.json.JSONTokener;

import static io.inji.verify.utils.Utils.isSdJwt;

@Service
@Slf4j
public class VerifiablePresentationSubmissionServiceImpl implements VerifiablePresentationSubmissionService {

    final VPSubmissionRepository vpSubmissionRepository;
    final CredentialsVerifier credentialsVerifier;
    final PresentationVerifier presentationVerifier;
    final VerifiablePresentationRequestServiceImpl verifiablePresentationRequestService;

    public VerifiablePresentationSubmissionServiceImpl(VPSubmissionRepository vpSubmissionRepository, CredentialsVerifier credentialsVerifier, PresentationVerifier presentationVerifier, VerifiablePresentationRequestServiceImpl verifiablePresentationRequestService) {
        this.vpSubmissionRepository = vpSubmissionRepository;
        this.credentialsVerifier = credentialsVerifier;
        this.presentationVerifier = presentationVerifier;
        this.verifiablePresentationRequestService = verifiablePresentationRequestService;
    }

    @Override
    public void submit(VPSubmissionDto vpSubmissionDto) {
        vpSubmissionRepository.save(new VPSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission(), vpSubmissionDto.getError(), vpSubmissionDto.getErrorDescription()));
        verifiablePresentationRequestService.invokeVpRequestStatusListener(vpSubmissionDto.getState());
    }

    private VPTokenResultDto processSubmission(VPSubmission vpSubmission, String transactionId) {
        log.info("Processing VP submission");

        List<VCResultDto> verificationResults = new ArrayList<>();
        List<VPVerificationStatus> vpVerificationStatuses = new ArrayList<>();

        try {
            Optional<String> error = Optional.ofNullable(vpSubmission.getError()).filter(e -> !e.isEmpty());
            if (error.isPresent()) {
                log.info("VP submission contains error");
                throw new VpSubmissionError(vpSubmission.getError(), vpSubmission.getErrorDescription());
            }

            log.info("Processing VP token matching");
            if (!isVPTokenMatching(vpSubmission, transactionId)) {
                throw new TokenMatchingFailedException();
            }

            Object vpTokenRaw = new JSONTokener(vpSubmission.getVpToken()).nextValue();
            List<JSONObject> jsonVpTokens = new ArrayList<>();
            List<String> sdJwtVpTokens = new ArrayList<>();

            if (vpTokenRaw instanceof String) {
                if (isSdJwt((String) vpTokenRaw)) {
                    sdJwtVpTokens.add((String) vpTokenRaw);
                } else {
                    String decodedJson = new String(Base64.getUrlDecoder().decode((String) vpTokenRaw));
                    vpTokenRaw = new JSONTokener(decodedJson).nextValue();
                }
            }

            if (vpTokenRaw instanceof JSONObject) {
                jsonVpTokens.add((JSONObject) vpTokenRaw);
            } else if (vpTokenRaw instanceof JSONArray array) {
                for (int i = 0; i < array.length(); i++) {
                    Object item = array.get(i);

                    if (item instanceof String) {
                        if (isSdJwt((String) item)) {
                            sdJwtVpTokens.add((String) item);
                        }else {
                            String decodedJson = new String(Base64.getUrlDecoder().decode((String) item));
                            item = new JSONTokener(decodedJson).nextValue();
                        }
                    }
                    if (item instanceof JSONObject) {
                        jsonVpTokens.add((JSONObject) item);
                    }
                }
            }

            log.info("Processing VP verification");
            log.info("Number of VP tokens to verify: " + (jsonVpTokens.size()+ ":"+ sdJwtVpTokens.size()));
            for (JSONObject vpToken : jsonVpTokens) {
                PresentationVerificationResult presentationVerificationResult = presentationVerifier.verify(vpToken.toString());
                vpVerificationStatuses.add(presentationVerificationResult.getProofVerificationStatus());
                List<VCResultDto> vcResults = presentationVerificationResult.getVcResults().stream()
                        .map(vcResult -> new VCResultDto(vcResult.getVc(), vcResult.getStatus()))
                        .toList();
                verificationResults.addAll(vcResults);
            }
            sdJwtVpTokens.forEach(sdJwtVpToken -> {
                VerificationResult verificationResult = credentialsVerifier.verify(sdJwtVpToken, CredentialFormat.VC_SD_JWT);
                verificationResults.add(new VCResultDto(sdJwtVpToken, verificationResult.getVerificationStatus() ? VerificationStatus.SUCCESS : VerificationStatus.INVALID));
            });
            boolean combinedVerificationStatus = getCombinedVerificationStatus(vpVerificationStatuses, verificationResults);
            log.info("VP submission processing done");
            return new VPTokenResultDto(transactionId, combinedVerificationStatus ? VPResultStatus.SUCCESS : VPResultStatus.FAILED, verificationResults, null, null);
        } catch (Exception e) {
            log.error("Failed to verify VP submission", e);
            if (e instanceof VpSubmissionError) return new VPTokenResultDto(transactionId, VPResultStatus.FAILED, verificationResults, ((VpSubmissionError) e).getErrorCode(), ((VpSubmissionError) e).getErrorDescription());
            return new VPTokenResultDto(transactionId, VPResultStatus.FAILED, verificationResults, e.getClass().getSimpleName(), e.getMessage());
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

    private static boolean getCombinedVerificationStatus(List<VPVerificationStatus> vpVerificationStatuses, List<VCResultDto> verificationResults) {
        if (vpVerificationStatuses.isEmpty() || verificationResults.isEmpty()) {
            return false;
        }
        boolean combinedVerificationStatus = true;
        for (VPVerificationStatus vpVerificationStatus : vpVerificationStatuses) {
            combinedVerificationStatus = combinedVerificationStatus && (vpVerificationStatus == VPVerificationStatus.VALID);
        }
        for (VCResultDto verificationResult : verificationResults) {
            combinedVerificationStatus = combinedVerificationStatus && (verificationResult.getVerificationStatus() == VerificationStatus.SUCCESS);
        }
        return combinedVerificationStatus;
    }
}