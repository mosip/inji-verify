package io.inji.verify.services;

import io.inji.verify.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.spi.PresentationDefinitionService;
import io.inji.verify.repository.PresentationDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PresentationDefinitionServiceImpl implements PresentationDefinitionService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Override
    public PresentationDefinitionDto getPresentationDefinition(String id) {
        try {
            PresentationDefinition presentationDefinition = presentationDefinitionRepository.findById(id).orElse(null);
            assert presentationDefinition != null;
            return  new PresentationDefinitionDto(presentationDefinition.getId(),presentationDefinition.getInputDescriptors(),presentationDefinition.getSubmissionRequirements());
        } catch (AssertionError e) {
            return null;
        }
    }
}
