package io.inji.verify.dto.verification;

import io.inji.verify.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VCVerificationStatusDto {
    VerificationStatus verificationStatus;
}
