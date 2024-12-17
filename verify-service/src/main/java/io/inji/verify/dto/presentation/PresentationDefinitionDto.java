package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PresentationDefinitionDto {
    String id;
    @JsonProperty("input_descriptors")
    @SerializedName("input_descriptors")
    List<InputDescriptorDto> inputDescriptors;

    @JsonProperty("submission_requirements")
    @SerializedName("submission_requirements")
    List<SubmissionRequirementDto> submissionRequirements;
}
