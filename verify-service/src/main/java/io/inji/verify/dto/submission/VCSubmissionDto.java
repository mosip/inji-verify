package io.inji.verify.dto.submission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import jakarta.validation.constraints.NotNull;

import java.io.Serial;
import java.io.Serializable;


@AllArgsConstructor
@Getter
public class VCSubmissionDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @NotNull
    private final String vc;
    private final String transactionId;
}
