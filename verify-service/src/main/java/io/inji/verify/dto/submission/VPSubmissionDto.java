package io.inji.verify.dto.submission;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VPSubmissionDto {

    @NotNull
    String vpToken;
    @NotNull
    PresentationSubmissionDto presentationSubmission;
    @NotNull
    String state;
}
