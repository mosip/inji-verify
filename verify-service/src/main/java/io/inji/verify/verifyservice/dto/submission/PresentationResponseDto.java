package io.inji.verify.verifyservice.dto.submission;

import io.inji.verify.verifyservice.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentationResponseDto {
    String transactionId;
    String vpToken;
    VerificationStatus verificationStatus;
}
