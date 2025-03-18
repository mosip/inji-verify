package io.inji.verify.dto.submission;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VPSubmissionDto {
    @NotNull
    String vpToken;
    @NotNull
    @Valid
    PresentationSubmissionDto presentationSubmission;
    @NotNull
    String state;
}
