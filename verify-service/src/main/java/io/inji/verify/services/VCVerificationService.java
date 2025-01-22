package io.inji.verify.services;

import io.inji.verify.dto.verification.VCVerificationStatusDto;

public interface VCVerificationService {

    VCVerificationStatusDto verify(String vc);
}
