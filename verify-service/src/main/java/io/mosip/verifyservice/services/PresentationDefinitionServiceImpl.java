package io.mosip.verifyservice.services;

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
    public PresentationDefinition getPresentationDefinition(String id) {
        return presentationDefinitionRepository.findById(id).orElse(null);
    }
}
