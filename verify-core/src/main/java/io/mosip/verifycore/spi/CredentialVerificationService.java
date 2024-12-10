package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.verification.VerificationStatusDto;

public interface CredentialVerificationService {

    VerificationStatusDto verify(String vc);
}
