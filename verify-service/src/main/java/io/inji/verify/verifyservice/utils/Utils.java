package io.inji.verify.verifyservice.utils;

import io.inji.verify.verifyservice.enums.VerificationStatus;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;

import java.util.UUID;

public class Utils {
    public static String generateID(String prefix){
        return prefix+"_"+UUID.randomUUID();
    }

    public static VerificationStatus getVerificationStatus(VerificationResult verificationResult){
        if (verificationResult.getVerificationStatus()){
            if (verificationResult.getVerificationErrorCode().equals(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED)){
                return VerificationStatus.EXPIRED;
            }
            return VerificationStatus.SUCCESS;
        }
        return VerificationStatus.INVALID;
    }
}
