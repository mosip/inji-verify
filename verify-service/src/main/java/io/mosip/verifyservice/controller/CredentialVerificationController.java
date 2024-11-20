package io.mosip.verifyservice.controller;

import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.verifycore.dto.verification.VerificationStatusDto;
import io.mosip.verifycore.enums.VerificationStatus;
import org.springframework.web.bind.annotation.*;
import io.mosip.vercred.vcverifier.CredentialsVerifier;

@RequestMapping(path = "/credential")
@RestController
public class CredentialVerificationController {
    @PostMapping()
    public VerificationStatusDto verify(@RequestBody String vc) {
        VerificationResult verificationResult = new CredentialsVerifier().verify(vc, CredentialFormat.LDP_VC);
        if (verificationResult.getVerificationStatus()) {
            if (verificationResult.getVerificationErrorCode().equals(CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED))
                return new VerificationStatusDto(VerificationStatus.EXPIRED);
            return new VerificationStatusDto(VerificationStatus.SUCCESS);
        }
        return new VerificationStatusDto(VerificationStatus.INVALID);
    }
}