package io.inji.verify.verifyservice.dto.authorizationRequest;

import io.inji.verify.verifyservice.enums.SubmissionState;
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