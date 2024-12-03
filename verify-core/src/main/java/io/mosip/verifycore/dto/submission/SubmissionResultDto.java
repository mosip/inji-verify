package io.mosip.verifycore.dto.submission;

import io.mosip.verifycore.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResultDto {
    String transactionId;
    String vpToken;
    VerificationStatus verificationStatus;
}
