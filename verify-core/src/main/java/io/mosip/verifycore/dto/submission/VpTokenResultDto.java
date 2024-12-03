package io.mosip.verifycore.dto.submission;

import io.mosip.verifycore.enums.SubmissionStatus;
import io.mosip.verifycore.models.VcResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VpTokenResultDto {
    String transactionId;
    SubmissionStatus submissionStatus;
    List<VcResult> vcResults;
}
