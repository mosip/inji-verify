package io.inji.verify.dto.presentation;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

public class VPDefinitionResponseDtoTest {

    @Test
    public void testSerializationAndDeserialization() {
        InputDescriptorDto inputDescriptorDto = new InputDescriptorDto("id1", "name1", "purpose1", List.of("group1"), null, null);
        SubmissionRequirementDto submissionRequirementDto = mock();

        VPDefinitionResponseDto presentationDefinitionDto = new VPDefinitionResponseDto(
                "pd1",
                List.of(inputDescriptorDto),
                List.of(submissionRequirementDto)
        );

        assertEquals(presentationDefinitionDto.getId(), "pd1");
        assertEquals(presentationDefinitionDto.getInputDescriptors(), List.of(inputDescriptorDto));
        assertEquals(presentationDefinitionDto.getSubmissionRequirements(), List.of(submissionRequirementDto));
    }
}