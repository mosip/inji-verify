package io.mosip.verifyservice.services;

import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.verifycore.dto.verification.VerificationStatusDto;
import io.mosip.verifycore.enums.VerificationStatus;
import io.mosip.verifycore.spi.CredentialVerificationService;
import io.mosip.verifyservice.beans.CredentialsVerifierSingleton;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CredentialVerificationServiceImpl implements CredentialVerificationService {
    @Autowired
    CredentialsVerifierSingleton credentialsVerifierSingleton;
    @Override
    public VerificationStatusDto verify(String vc) {
        VerificationResult verificationResult = credentialsVerifierSingleton.verify(vc, CredentialFormat.LDP_VC);
        if (verificationResult.getVerificationStatus()) {
            if (verificationResult.getVerificationErrorCode().equals(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED))
                return new VerificationStatusDto(VerificationStatus.EXPIRED);
            return new VerificationStatusDto(VerificationStatus.SUCCESS);
        }
        return new VerificationStatusDto(VerificationStatus.INVALID);
    }
}
