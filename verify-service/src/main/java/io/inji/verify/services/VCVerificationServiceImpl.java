package io.inji.verify.services;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.enums.VerificationStatus;
import io.inji.verify.spi.VCVerificationService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VCVerificationServiceImpl implements VCVerificationService {
    @Autowired
    CredentialsVerifier credentialsVerifier;

    @Override
    public VCVerificationStatusDto verify(String vc) {
        VerificationResult verificationResult = credentialsVerifier.verify(vc, CredentialFormat.LDP_VC);
        if (verificationResult.getVerificationStatus()) {
            if (verificationResult.getVerificationErrorCode().equals(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED))
                return new VCVerificationStatusDto(VerificationStatus.EXPIRED);
            return new VCVerificationStatusDto(VerificationStatus.SUCCESS);
        }
        return new VCVerificationStatusDto(VerificationStatus.INVALID);
    }
}
