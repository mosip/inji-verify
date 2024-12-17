package io.inji.verify.services;

import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.models.PresentationDefinition;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class PresentationDefinitionServiceImplTest {


    @Test
    public void shouldReturnValidPresentationDefinitionForGivenId() {
        PresentationDefinitionRepository mockRepository = mock(PresentationDefinitionRepository.class);
        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        PresentationDefinition mockPresentationDefinition = new PresentationDefinition("test_id", mockInputDescriptorDtos, mockSubmissionRequirementDtos);
        when(mockRepository.findById("test_id")).thenReturn(java.util.Optional.of(mockPresentationDefinition));

        PresentationDefinitionServiceImpl service = new PresentationDefinitionServiceImpl();
        service.presentationDefinitionRepository = mockRepository;

        PresentationDefinitionDto result = service.getPresentationDefinition("test_id");

        assertNotNull(result);
        assertEquals("test_id", result.getId());
        assertEquals(mockInputDescriptorDtos, result.getInputDescriptors());
        assertEquals(mockSubmissionRequirementDtos, result.getSubmissionRequirements());
    }

    @Test
    public void shouldReturnNullIfPresentationDefinitionIsNotFoundForGivenId() {
        PresentationDefinitionRepository mockRepository = mock(PresentationDefinitionRepository.class);
        when(mockRepository.findById("non_existent_id")).thenReturn(java.util.Optional.empty());

        PresentationDefinitionServiceImpl service = new PresentationDefinitionServiceImpl();
        service.presentationDefinitionRepository = mockRepository;

        PresentationDefinitionDto result = service.getPresentationDefinition("non_existent_id");

        assertNull(result);
    }
}