package io.inji.verify.verifyservice.dto.submission;

import io.inji.verify.verifyservice.enums.SubmissionStatus;
import io.inji.verify.verifyservice.models.VCResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VPTokenResultDto {
    String transactionId;
    SubmissionStatus submissionStatus;
    List<VCResult> VCResults;
}
