package io.inji.verify.verifyservice.singletons;

import io.mosip.vercred.vcverifier.CredentialsVerifier;
import org.springframework.stereotype.Component;

@Component
public class CredentialsVerifierSingleton {
    private final CredentialsVerifier credentialsVerifier = new CredentialsVerifier();

    public CredentialsVerifier getInstance() {
        return credentialsVerifier;
    }
}
