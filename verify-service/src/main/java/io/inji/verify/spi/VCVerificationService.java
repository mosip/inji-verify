package io.inji.verify.spi;

import io.inji.verify.dto.verification.VCVerificationStatusDto;

public interface VCVerificationService {

    VCVerificationStatusDto verify(String vc);
}
