package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.enums.VerificationStatus;
import io.inji.verify.services.VCVerificationService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VCVerificationServiceImpl implements VCVerificationService {
    @Autowired
    CredentialsVerifier credentialsVerifier;

    @Override
    public VCVerificationStatusDto verify(String vc) {
        VerificationResult verificationResult = credentialsVerifier.verify(vc, CredentialFormat.LDP_VC);
        log.info("VC verification result:: {}", verificationResult);
        if (verificationResult.getVerificationStatus()) {
            if (verificationResult.getVerificationErrorCode().equals(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED))
                return new VCVerificationStatusDto(VerificationStatus.EXPIRED);
            return new VCVerificationStatusDto(VerificationStatus.SUCCESS);
        }
        return new VCVerificationStatusDto(VerificationStatus.INVALID);
    }
}
