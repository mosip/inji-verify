package io.inji.verify.dto.submission;

import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.models.VCResult;
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
    VPResultStatus VPResultStatus;
    List<VCResult> VCResults;
}
