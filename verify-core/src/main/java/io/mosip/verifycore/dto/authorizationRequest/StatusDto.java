package io.mosip.verifycore.dto.authorizationRequest;

import io.mosip.verifycore.enums.SubmissionState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusDto {
    String transactionId;
    String requestId;
    SubmissionState submissionState;
}