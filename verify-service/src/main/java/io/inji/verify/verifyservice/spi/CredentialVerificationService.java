package io.inji.verify.verifyservice.spi;

import io.inji.verify.verifyservice.dto.verification.VerificationStatusDto;

public interface CredentialVerificationService {

    VerificationStatusDto verify(String vc);
}
