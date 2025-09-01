package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.services.VCVerificationService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.utils.Util;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Base64;
import org.json.JSONObject;

@Slf4j
@Service
public class VCVerificationServiceImpl implements VCVerificationService {

    private final CredentialsVerifier credentialsVerifier;

    public VCVerificationServiceImpl(CredentialsVerifier credentialsVerifier) {
        this.credentialsVerifier = credentialsVerifier;
    }

    @Override
    public VCVerificationStatusDto verify(String vc) {
        CredentialFormat format = detectCredentialFormat(vc);

        log.info("Detected credential format: {}", format);

        VerificationResult verificationResult = credentialsVerifier.verify(vc, format);
        log.info("VC verification result:: {}", verificationResult);
        return new VCVerificationStatusDto(Util.INSTANCE.getVerificationStatus(verificationResult));

    }

    public CredentialFormat detectCredentialFormat(String vc) {
        try {
            String[] sdJwtParts = vc.split("~");
            String jwtPart = sdJwtParts[0];
            String[] jwtSections = jwtPart.split("\\.");

            log.info("Attempting to parse as JWT...");
            String headerJson = new String(Base64.getUrlDecoder().decode(jwtSections[0]));
            new JSONObject(headerJson);
            return CredentialFormat.VC_SD_JWT;
        } catch (Exception jwtEx) {
            log.warn("Not a valid JWT: {}", jwtEx.getMessage());
            try {
                new JSONObject(vc);
                return CredentialFormat.LDP_VC;
            } catch (Exception jsonEx) {
                log.error("Credential is neither valid JWT nor valid JSON: {}", jsonEx.getMessage());
                return CredentialFormat.LDP_VC;
            }
        }
    }

}
