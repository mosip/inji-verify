package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VPDefinitionResponseDto {
    String id;
    @JsonProperty("input_descriptors")
    @SerializedName("input_descriptors")
    List<InputDescriptorDto> inputDescriptors;

    @JsonProperty("submission_requirements")
    @SerializedName("submission_requirements")
    List<SubmissionRequirementDto> submissionRequirements;
}
