package io.mosip.verifyservice.services;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.verifycore.dto.submission.VPSubmissionDto;
import io.mosip.verifycore.dto.submission.ResponseAcknowledgementDto;
import io.mosip.verifycore.dto.submission.VPTokenResultDto;
import io.mosip.verifycore.enums.SubmissionState;
import io.mosip.verifycore.enums.SubmissionStatus;
import io.mosip.verifycore.enums.VerificationStatus;
import io.mosip.verifycore.exception.VerificationFailedException;
import io.mosip.verifycore.models.VCResult;
import io.mosip.verifycore.models.VPSubmission;
import io.mosip.verifycore.shared.Constants;
import io.mosip.verifycore.spi.VerifiablePresentationSubmissionService;
import io.mosip.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.mosip.verifyservice.repository.VPSubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static io.mosip.verifycore.utils.SecurityUtils.*;
import static io.mosip.verifycore.utils.Utils.getVerificationStatus;

@Service
@Slf4j
public class VerifiablePresentationSubmissionServiceImpl implements VerifiablePresentationSubmissionService {

    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VPSubmissionRepository vpSubmissionRepository;

    @Override
    public ResponseAcknowledgementDto submit(VPSubmissionDto vpSubmissionDto) {
        new Thread(() -> {
            processSubmission(vpSubmissionDto);
        }).start();
        return new ResponseAcknowledgementDto("", "", "");

    }

    private void processSubmission(VPSubmissionDto vpSubmissionDto) {
        JSONObject vpProof = new JSONObject(vpSubmissionDto.getVpToken()).getJSONObject(Constants.KEY_PROOF);
        String jws = getFormattedJws(vpProof.getString(Constants.KEY_JWS));
        String publicKeyPem = vpProof.getString(Constants.KEY_VERIFICATION_METHOD);

        //TODO: Dynamic algo type
        try {
            readX509PublicKey(publicKeyPem);
            Algorithm algorithm = Algorithm.RSA256(readX509PublicKey(publicKeyPem), null);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(jws);

            JSONArray verifiableCredentials = new JSONObject(vpSubmissionDto.getVpToken()).getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
            List<VCResult> verificationResults = getVCVerificationResults(verifiableCredentials);
            boolean combinedVerificationStatus = true;
            for (VCResult verificationResult : verificationResults) {
                combinedVerificationStatus = combinedVerificationStatus && (verificationResult.getVerificationStatus() == VerificationStatus.SUCCESS);
            }
            if (!combinedVerificationStatus) {
                throw new VerificationFailedException();
            }
            vpSubmissionRepository.save(new VPSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission(), SubmissionStatus.SUCCESS));
        } catch (Exception e) {
            log.error("Failed to verify",e);
            vpSubmissionRepository.save(new VPSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission(), SubmissionStatus.FAILED));
        }

        authorizationRequestCreateResponseRepository.findById(vpSubmissionDto.getState()).map(authorizationRequestCreateResponse -> {
            authorizationRequestCreateResponse.setSubmissionState(SubmissionState.COMPLETED);
            authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
            return null;
        });
    }

    @Override
    public VPTokenResultDto getVPResult(String requestId, String transactionId) {
        VPSubmission VPSubmissionResult = vpSubmissionRepository.findById(requestId).orElse(null);
        if (VPSubmissionResult == null || VPSubmissionResult.getSubmissionStatus() == SubmissionStatus.FAILED){
            return new VPTokenResultDto(transactionId,SubmissionStatus.FAILED,null);
        }
        JSONArray verifiableCredentials = new JSONObject(VPSubmissionResult.getVpToken()).getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
        List<VCResult> vcVerificationResults = getVCVerificationResults(verifiableCredentials);
        return new VPTokenResultDto(transactionId,SubmissionStatus.SUCCESS,vcVerificationResults);
    }

    private List<VCResult> getVCVerificationResults(JSONArray verifiableCredentials) {
        List<VCResult> verificationResults = new ArrayList<>();
        for (Object verifiableCredential : verifiableCredentials) {
            JSONObject credential = new JSONObject((String) verifiableCredential).getJSONObject(Constants.KEY_VERIFIABLE_CREDENTIAL).getJSONObject(Constants.KEY_CREDENTIAL);
            VerificationResult verificationResult = new CredentialsVerifier().verify(credential.toString(), CredentialFormat.LDP_VC);
            VerificationStatus singleVCVerification = getVerificationStatus(verificationResult);
            verificationResults.add(new VCResult(credential.toString(),singleVCVerification));
        }
        return verificationResults;
    }
}

