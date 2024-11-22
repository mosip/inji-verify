package io.mosip.verifyservice.services;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.VpSubmissionResponseDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.enums.SubmissionStatus;
import io.mosip.verifycore.models.VpSubmission;
import io.mosip.verifycore.spi.VerifiablePresentationSubmissionService;
import io.mosip.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.mosip.verifyservice.repository.VpSubmissionRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        String jws = getFormattedJws(new JSONObject(vpSubmissionDto.getVpToken()).getJSONObject("proof").getString("jws"));
        String publicKeyPem = new JSONObject(vpSubmissionDto.getVpToken()).getJSONObject("proof").getString("verificationMethod");

        //TODO: Dynamic algo type
        //TODO: try catch for key exceptions and failure scenario
        try {
//            getJwsAlgorithm(jws,publicKeyPem);
            Algorithm algorithm = Algorithm.RSA256(getPublicKeyFromString(publicKeyPem), null);
            JWTVerifier verifier = JWT.require(algorithm).build();

            DecodedJWT decodedJWT = verifier.verify(jws);
            System.out.println(decodedJWT);
            //verify vc
            JSONArray verifiableCredentials = new JSONObject(vpSubmissionDto.getVpToken()).getJSONArray("verifiableCredential");
            boolean combinedVcVerificationStatus = true;
            for (Object verifiableCredential : verifiableCredentials) {
                JSONObject next = (JSONObject) verifiableCredential;
                JSONObject credential = next.getJSONObject("verifiableCredential").getJSONObject("credential");
                VerificationResult singleVcVerification = new CredentialsVerifier().verify(credential.toString(), CredentialFormat.LDP_VC);
                combinedVcVerificationStatus = combinedVcVerificationStatus && singleVcVerification.getVerificationStatus();
            }
            if (!combinedVcVerificationStatus) {

                //TODO: Uncomment
                throw new Exception("Verification Failed");
            }
            //set valid
            authorizationRequestCreateResponseRepository.findById(vpSubmissionDto.getState()).map(authorizationRequestCreateResponse -> {
                authorizationRequestCreateResponse.setStatus(Status.COMPLETED);
                authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
                return null;
            });
            // update DB
            vpSubmissionRepository.save(new VpSubmission(vpSubmissionDto.getState(),vpSubmissionDto.getVpToken(),vpSubmissionDto.getPresentationSubmission()));
            // return success
            return new VpSubmissionResponseDto(SubmissionStatus.ACCEPTED,"","","");


        } catch (Exception e) {
            //set invalid
            authorizationRequestCreateResponseRepository.findById(vpSubmissionDto.getState()).map(authorizationRequestCreateResponse -> {
                authorizationRequestCreateResponse.setStatus(Status.FAILED);
                authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
                return null;
            });
            // update DB

            // return failed
            return new VpSubmissionResponseDto(SubmissionStatus.REJECTED,"",e.getMessage(),e.getMessage());
        }
    }

    @Override
    public VpSubmission getSubmissionResult(String requestId) {
        return vpSubmissionRepository.findById(requestId).map(vpSubmission -> new VpSubmission(vpSubmission.getState(), vpSubmission.getVpToken(), vpSubmission.getPresentationSubmission())).orElse(null);
    }
}

