package io.inji.verify.dto.submission;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
public class VCSubmissionResponseDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String transactionId;
}
