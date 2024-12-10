package io.mosip.verifycore.dto.submission;

import io.mosip.verifycore.enums.SubmissionStatus;
import io.mosip.verifycore.models.VCResult;
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
