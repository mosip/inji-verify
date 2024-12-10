package io.mosip.verifyservice.beans;

import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.springframework.stereotype.Component;

@Component
public class CredentialsVerifierSingleton {
    private final CredentialsVerifier credentialsVerifier = new CredentialsVerifier();

    public VerificationResult verify(String vc, CredentialFormat credentialFormat){
        return credentialsVerifier.verify(vc, credentialFormat);
    }
}
