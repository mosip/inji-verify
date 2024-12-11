package io.inji.verify.verifyservice.services;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import io.inji.verify.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.verifyservice.repository.VPSubmissionRepository;
import io.inji.verify.verifyservice.singletons.CredentialsVerifierSingleton;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.inji.verify.verifyservice.dto.submission.VPSubmissionDto;
import io.inji.verify.verifyservice.dto.submission.ResponseAcknowledgementDto;
import io.inji.verify.verifyservice.dto.submission.VPTokenResultDto;
import io.inji.verify.verifyservice.enums.SubmissionState;
import io.inji.verify.verifyservice.enums.SubmissionStatus;
import io.inji.verify.verifyservice.enums.VerificationStatus;
import io.inji.verify.verifyservice.exception.VerificationFailedException;
import io.inji.verify.verifyservice.models.VCResult;
import io.inji.verify.verifyservice.models.VPSubmission;
import io.inji.verify.verifyservice.shared.Constants;
import io.inji.verify.verifyservice.spi.VerifiablePresentationSubmissionService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static io.inji.verify.verifyservice.utils.SecurityUtils.*;
import static io.inji.verify.verifyservice.utils.Utils.getVerificationStatus;

@Service
@Slf4j
public class VerifiablePresentationSubmissionServiceImpl implements VerifiablePresentationSubmissionService {

    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VPSubmissionRepository vpSubmissionRepository;

    @Autowired
    CredentialsVerifierSingleton credentialsVerifierSingleton;

    @Override
    public ResponseAcknowledgementDto submit(VPSubmissionDto vpSubmissionDto) {
        new Thread(() -> {
            processSubmission(vpSubmissionDto);
        }).start();
        return new ResponseAcknowledgementDto("", "", "");

    }

    private void processSubmission(VPSubmissionDto vpSubmissionDto) {
        JSONObject vpProof = new JSONObject(vpSubmissionDto.getVpToken()).getJSONObject(Constants.KEY_PROOF);
        String jws = vpProof.getString(Constants.KEY_JWS);
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
            VerificationResult verificationResult = credentialsVerifierSingleton.getInstance().verify(credential.toString(), CredentialFormat.LDP_VC);
            VerificationStatus singleVCVerification = getVerificationStatus(verificationResult);
            verificationResults.add(new VCResult(credential.toString(),singleVCVerification));
        }
        return verificationResults;
    }
}

