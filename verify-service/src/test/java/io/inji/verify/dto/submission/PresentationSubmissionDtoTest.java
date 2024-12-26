package io.inji.verify.dto.submission;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PresentationSubmissionDtoTest {

    @Test
    public void shouldTestConstructor() {
        String id = "submission1";
        String definitionId = "pd1";
        DescriptorMapDto descriptorMapDto = new DescriptorMapDto("id1", "string", "path1", new PathNestedDto("parent", "child"));
        List<DescriptorMapDto> descriptorMapList = new ArrayList<>();
        descriptorMapList.add(descriptorMapDto);

        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto(id, definitionId, descriptorMapList);

        assertEquals(id, submissionDto.getId());
        assertEquals(definitionId, submissionDto.getDefinitionId());
        assertEquals(descriptorMapList, submissionDto.getDescriptorMap());
    }

}