package io.mosip.verifycore.models;

import io.mosip.verifycore.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {
    String vpToken;
    VerificationStatus verificationStatus;
}