package io.inji.verify.services.impl;

import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.models.PresentationDefinition;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class VPDefinitionServiceImplTest {


    @Test
    public void shouldReturnValidPresentationDefinitionForGivenId() {
        PresentationDefinitionRepository mockRepository = mock(PresentationDefinitionRepository.class);
        List<InputDescriptorDto> mockInputDescriptorDtos = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirementDtos = mock();
        PresentationDefinition mockPresentationDefinition = new PresentationDefinition("test_id", mockInputDescriptorDtos,"name","purpose", mockSubmissionRequirementDtos);
        when(mockRepository.findById("test_id")).thenReturn(java.util.Optional.of(mockPresentationDefinition));

        VPDefinitionServiceImpl service = new VPDefinitionServiceImpl();
        service.presentationDefinitionRepository = mockRepository;

        VPDefinitionResponseDto result = service.getPresentationDefinition("test_id");

        assertNotNull(result);
        assertEquals("test_id", result.getId());
        assertEquals(mockInputDescriptorDtos, result.getInputDescriptors());
        assertEquals(mockSubmissionRequirementDtos, result.getSubmissionRequirements());
    }

    @Test
    public void shouldReturnNullIfPresentationDefinitionIsNotFoundForGivenId() {
        PresentationDefinitionRepository mockRepository = mock(PresentationDefinitionRepository.class);
        when(mockRepository.findById("non_existent_id")).thenReturn(java.util.Optional.empty());

        VPDefinitionServiceImpl service = new VPDefinitionServiceImpl();
        service.presentationDefinitionRepository = mockRepository;

        VPDefinitionResponseDto result = service.getPresentationDefinition("non_existent_id");

        assertNull(result);
    }
}