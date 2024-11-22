package io.mosip.verifyservice.controller;

import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.springframework.web.bind.annotation.*;
import io.mosip.vercred.vcverifier.CredentialsVerifier;

@RequestMapping(path = "/credential")
@RestController
public class CredentialVerificationController {
    @PostMapping()
    public VerificationResult verify(@RequestBody String vc) {
        return new CredentialsVerifier().verify(vc, CredentialFormat.LDP_VC);
    }
}