package io.mosip.verifyservice.services;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.VpSubmissionResponseDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.enums.VerificationStatus;
import io.mosip.verifycore.exception.VerificationFailedException;
import io.mosip.verifycore.models.VpSubmission;
import io.mosip.verifycore.shared.Constants;
import io.mosip.verifycore.spi.VerifiablePresentationSubmissionService;
import io.mosip.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.mosip.verifyservice.repository.VpSubmissionRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static io.mosip.verifycore.utils.SecurityUtils.getFormattedJws;
import static io.mosip.verifycore.utils.SecurityUtils.getPublicKeyFromString;

@Service
public class VerifiablePresentationSubmissionServiceImpl implements VerifiablePresentationSubmissionService {

    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VpSubmissionRepository vpSubmissionRepository;

    @Override
    public VpSubmissionResponseDto submit(VpSubmissionDto vpSubmissionDto) {
        new Thread(() -> {
            processSubmission(vpSubmissionDto);
        }).start();
        return new VpSubmissionResponseDto("", "", "");

    }

    private void processSubmission(VpSubmissionDto vpSubmissionDto) {
        JSONObject vpProof = new JSONObject(vpSubmissionDto.getVpToken()).getJSONObject(Constants.KEY_PROOF);
        String jws = getFormattedJws(vpProof.getString(Constants.KEY_JWS));
        String publicKeyPem = vpProof.getString(Constants.KEY_VERIFICATION_METHOD);

        //TODO: Dynamic algo type
        try {
            Algorithm algorithm = Algorithm.RSA256(getPublicKeyFromString(publicKeyPem), null);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(jws);

            JSONArray verifiableCredentials = new JSONObject(vpSubmissionDto.getVpToken()).getJSONArray(Constants.KEY_VERIFIABLE_CREDENTIAL);
            List<VerificationResult> verificationResults = new ArrayList<>();
            for (Object verifiableCredential : verifiableCredentials) {
                JSONObject credential = new JSONObject((String) verifiableCredential).getJSONObject(Constants.KEY_VERIFIABLE_CREDENTIAL).getJSONObject(Constants.KEY_CREDENTIAL);
                VerificationResult singleVcVerification = new CredentialsVerifier().verify(credential.toString(), CredentialFormat.LDP_VC);
                System.out.println(singleVcVerification);
                verificationResults.add(singleVcVerification);
            }
            boolean combinedVerificationStatus = true;
            for (VerificationResult verificationResult : verificationResults) {
                combinedVerificationStatus = combinedVerificationStatus && verificationResult.getVerificationStatus();
            }
            if (!combinedVerificationStatus) {
                throw new VerificationFailedException();
            }
            vpSubmissionRepository.save(new VpSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission(), VerificationStatus.SUCCESS));
        } catch (Exception e) {
            e.printStackTrace();
            vpSubmissionRepository.save(new VpSubmission(vpSubmissionDto.getState(), vpSubmissionDto.getVpToken(), vpSubmissionDto.getPresentationSubmission(), VerificationStatus.INVALID));
        }

        authorizationRequestCreateResponseRepository.findById(vpSubmissionDto.getState()).map(authorizationRequestCreateResponse -> {
            authorizationRequestCreateResponse.setStatus(Status.COMPLETED);
            authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
            return null;
        });
    }

    @Override
    public VpSubmission getSubmissionResult(String requestId) {
        return vpSubmissionRepository.findById(requestId).map(vpSubmission -> new VpSubmission(vpSubmission.getState(), vpSubmission.getVpToken(), vpSubmission.getPresentationSubmission(), vpSubmission.getVerificationStatus())).orElse(null);
    }
}

