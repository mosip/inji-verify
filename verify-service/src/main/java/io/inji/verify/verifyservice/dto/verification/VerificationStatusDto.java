package io.inji.verify.verifyservice.dto.verification;

import io.inji.verify.verifyservice.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationStatusDto {
    VerificationStatus verificationStatus;
}
