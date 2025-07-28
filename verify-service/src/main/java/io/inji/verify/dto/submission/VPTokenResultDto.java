package io.inji.verify.dto.submission;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.dto.result.VCResultDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VPTokenResultDto implements Serializable {
    public VPTokenResultDto() {
    }

    @Serial
    private static final long serialVersionUID = 1L;
    String transactionId;
    VPResultStatus vpResultStatus;
    List<VCResultDto> vcResults;
}
