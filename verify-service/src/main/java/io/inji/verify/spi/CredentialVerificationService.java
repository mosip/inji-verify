package io.inji.verify.spi;

import io.inji.verify.dto.verification.VerificationStatusDto;

public interface CredentialVerificationService {

    VerificationStatusDto verify(String vc);
}
