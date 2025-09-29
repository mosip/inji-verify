package io.inji.verify.services.impl;

import io.inji.verify.dto.submission.DescriptorMapDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.exception.InvalidVpTokenException;
import io.inji.verify.exception.TokenMatchingFailedException;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.dto.result.VCResultDto;
import io.inji.verify.exception.VPSubmissionWalletError;
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

    private VPTokenResultDto processSubmission(VPSubmission vpSubmission, String transactionId) throws VPSubmissionWalletError {
        log.info("Processing VP submission");

        List<VCResultDto> verificationResults = new ArrayList<>();
        List<VPVerificationStatus> vpVerificationStatuses = new ArrayList<>();

        try {
            Optional<String> error = Optional.ofNullable(vpSubmission.getError()).filter(e -> !e.isEmpty());
            if (error.isPresent()) {
                log.info("VP submission from wallet has error");
                throw new VPSubmissionWalletError(vpSubmission.getError(), vpSubmission.getErrorDescription());
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
                        } else {
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
            log.info("Number of VP tokens to verify: {}", jsonVpTokens.size() + ":" + sdJwtVpTokens.size());
            if (jsonVpTokens.isEmpty() && sdJwtVpTokens.isEmpty()) {
                throw new InvalidVpTokenException();
            }
            for (JSONObject vpToken : jsonVpTokens) {
                PresentationVerificationResult presentationVerificationResult = presentationVerifier.verify(vpToken.toString());
                vpVerificationStatuses.add(presentationVerificationResult.getProofVerificationStatus());
                List<VCResultDto> vcResults = presentationVerificationResult.getVcResults().stream()
                        .map(vcResult -> new VCResultDto(vcResult.getVc(), vcResult.getStatus()))
                        .toList();
                verificationResults.addAll(vcResults);
            }
            for (String sdJwtVpToken : sdJwtVpTokens) {
                VerificationResult verificationResult = credentialsVerifier.verify(sdJwtVpToken, CredentialFormat.VC_SD_JWT);
                if (!verificationResult.getVerificationStatus()) {
                    log.error("SD-JWT VC verification result errors : {} {}", verificationResult.getVerificationErrorCode(), verificationResult.getVerificationMessage());
                }
                verificationResults.add(new VCResultDto(sdJwtVpToken, verificationResult.getVerificationStatus() ? VerificationStatus.SUCCESS : VerificationStatus.INVALID));
            }
            log.info("VP submission processing done");
            return new VPTokenResultDto(transactionId, getCombinedVerificationStatus(vpVerificationStatuses, verificationResults), verificationResults);
        } catch (VPSubmissionWalletError e) {
            log.error("Received wallet error: {} - {}", e.getErrorCode(), e.getErrorDescription());
            throw e;
        } catch (Exception e) {
            log.error("Failed to verify VP submission", e);
            return new VPTokenResultDto(transactionId, VPResultStatus.FAILED, verificationResults);
        }
    }

    @Override
    public VPTokenResultDto getVPResult(List<String> requestIds, String transactionId) throws VPSubmissionNotFoundException, VPSubmissionWalletError {
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

    private VPResultStatus getCombinedVerificationStatus(List<VPVerificationStatus> vpVerificationStatuses, List<VCResultDto> verificationResults) {
        boolean combinedVerificationStatus = true;
        for (VPVerificationStatus vpVerificationStatus : vpVerificationStatuses) {
            combinedVerificationStatus = combinedVerificationStatus && (vpVerificationStatus == VPVerificationStatus.VALID);
        }
        for (VCResultDto verificationResult : verificationResults) {
            combinedVerificationStatus = combinedVerificationStatus && (verificationResult.getVerificationStatus() == VerificationStatus.SUCCESS);
        }
        return combinedVerificationStatus ? VPResultStatus.SUCCESS : VPResultStatus.FAILED;
    }
}