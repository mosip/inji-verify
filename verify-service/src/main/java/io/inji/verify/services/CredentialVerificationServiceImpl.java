package io.inji.verify.services;

import io.inji.verify.dto.verification.VerificationStatusDto;
import io.inji.verify.enums.VerificationStatus;
import io.inji.verify.singletons.CredentialsVerifierSingleton;
import io.inji.verify.spi.CredentialVerificationService;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CredentialVerificationServiceImpl implements CredentialVerificationService {
    @Autowired
    CredentialsVerifierSingleton credentialsVerifierSingleton;
    @Override
    public VerificationStatusDto verify(String vc) {
        VerificationResult verificationResult = credentialsVerifierSingleton.getInstance().verify(vc, CredentialFormat.LDP_VC);
        if (verificationResult.getVerificationStatus()) {
            if (verificationResult.getVerificationErrorCode().equals(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED))
                return new VerificationStatusDto(VerificationStatus.EXPIRED);
            return new VerificationStatusDto(VerificationStatus.SUCCESS);
        }
        return new VerificationStatusDto(VerificationStatus.INVALID);
    }
}
