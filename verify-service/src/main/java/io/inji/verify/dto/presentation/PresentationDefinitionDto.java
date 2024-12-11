package io.inji.verify.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentationDefinitionDto {
    String id;
    List<InputDescriptorDto> inputDescriptors;
    List<SubmissionRequirementDto> submissionRequirements;
}
