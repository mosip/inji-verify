package io.inji.verify.dto.submission;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@AllArgsConstructor
public class VPSubmissionDto implements Serializable {
    public VPSubmissionDto() {
    }

    @Serial
    private static final long serialVersionUID = 1L;
    @NotNull
    String vpToken;
    @NotNull
    @Valid
    PresentationSubmissionDto presentationSubmission;
    @NotNull
    String state;
}
