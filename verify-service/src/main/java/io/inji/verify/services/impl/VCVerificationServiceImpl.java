package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.services.VCVerificationService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.utils.Util;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class VCVerificationServiceImpl implements VCVerificationService {

    private final CredentialsVerifier credentialsVerifier;

    public VCVerificationServiceImpl(CredentialsVerifier credentialsVerifier) {
        this.credentialsVerifier = credentialsVerifier;
    }

    @Override
    public VCVerificationStatusDto verify(String vc, String contentType) {
        CredentialFormat format;
        if ("application/vc+sd-jwt".equals(contentType)) {
            format = CredentialFormat.VC_SD_JWT;
        } else if ("application/ld+json".equals(contentType)) {
            format = CredentialFormat.LDP_VC;
        } else {
            throw new IllegalArgumentException("Unsupported Content-Type: " + contentType);
        }

        log.info("Using credential format based on Content-Type: {}", format);

        VerificationResult verificationResult = credentialsVerifier.verify(vc, format);
        log.info("VC verification result:: {}", verificationResult);

        return new VCVerificationStatusDto(Util.INSTANCE.getVerificationStatus(verificationResult));
    }
}
