package io.mosip.verifycore.dto.presentation;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentationDefinitionDto {
    String id;


    @JsonProperty("input_descriptors")
    List<InputDescriptorDto> inputDescriptors;

    @JsonProperty("submission_requirements")
    List<SubmissionRequirementDto> submissionRequirements;
}
