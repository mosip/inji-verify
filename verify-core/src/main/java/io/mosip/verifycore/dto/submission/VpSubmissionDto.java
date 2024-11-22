package io.mosip.verifycore.dto.submission;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("vp_token")
    String vpToken;
    @NotNull
    @JsonProperty("presentation_submission")
    PresentationSubmissionDto presentationSubmission;
    @NotNull
    String state;
}
