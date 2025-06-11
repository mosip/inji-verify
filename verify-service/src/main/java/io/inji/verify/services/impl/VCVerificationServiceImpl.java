package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.services.VCVerificationService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.utils.Util;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VCVerificationServiceImpl implements VCVerificationService {
    final CredentialsVerifier credentialsVerifier;

    public VCVerificationServiceImpl(CredentialsVerifier credentialsVerifier) {
        this.credentialsVerifier = credentialsVerifier;
    }

    @Override
    public VCVerificationStatusDto verify(String vc) {
        VerificationResult verificationResult = credentialsVerifier.verify(vc, CredentialFormat.LDP_VC);
        log.info("VC verification result:: {}", verificationResult);
        return new VCVerificationStatusDto(Util.Companion.getVerificationStatus(verificationResult));
    }
}
