package io.inji.verify.services;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.spi.VPDefinitionService;
import io.inji.verify.repository.PresentationDefinitionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VPDefinitionServiceImpl implements VPDefinitionService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;

    @Override
    public VPDefinitionResponseDto getPresentationDefinition(String id) {

        return presentationDefinitionRepository.findById(id)
                .map(presentationDefinition ->  new VPDefinitionResponseDto(presentationDefinition.getId(), presentationDefinition.getInputDescriptors(), presentationDefinition.getSubmissionRequirements()))
                .orElse(null);
    }
}