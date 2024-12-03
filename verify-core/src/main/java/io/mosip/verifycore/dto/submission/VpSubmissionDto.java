package io.mosip.verifycore.dto.submission;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VpSubmissionDto {

    @NotNull
    String vpToken;
    @NotNull
    PresentationSubmissionDto presentationSubmission;
    @NotNull
    String state;
}
