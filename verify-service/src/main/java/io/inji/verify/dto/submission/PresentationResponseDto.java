package io.inji.verify.dto.submission;

import io.inji.verify.enums.VerificationStatus;
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
