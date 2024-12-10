package io.mosip.verifyservice.services;

import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifycore.spi.PresentationDefinitionService;
import io.mosip.verifyservice.repository.PresentationDefinitionRepository;
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
