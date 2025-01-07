package io.inji.verify.services;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.spi.VPDefinitionService;
import io.inji.verify.repository.PresentationDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VPDefinitionServiceImpl implements VPDefinitionService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Override
    public VPDefinitionResponseDto getPresentationDefinition(String id) {
        try {
            PresentationDefinition presentationDefinition = presentationDefinitionRepository.findById(id).orElse(null);
            assert presentationDefinition != null;
            return  new VPDefinitionResponseDto(presentationDefinition.getId(),presentationDefinition.getInputDescriptors(),presentationDefinition.getSubmissionRequirements());
        } catch (AssertionError e) {
            return null;
        }
    }
}
