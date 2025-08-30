package io.inji.verify.services.impl;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.services.VPDefinitionService;
import io.inji.verify.repository.PresentationDefinitionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VPDefinitionServiceImpl implements VPDefinitionService {

    final PresentationDefinitionRepository presentationDefinitionRepository;

    public VPDefinitionServiceImpl(PresentationDefinitionRepository presentationDefinitionRepository) {
        this.presentationDefinitionRepository = presentationDefinitionRepository;
    }

    @Override
    @Cacheable(value = "presentationDefinitionCache",
            key = "#id",
            unless = "#result == null",
            condition = "@redisConfigProperties.presentationDefinitionCacheEnabled")
    public VPDefinitionResponseDto getPresentationDefinition(String id) {

        return presentationDefinitionRepository.findById(id)
                .map(presentationDefinition ->  new VPDefinitionResponseDto(presentationDefinition.getId(), presentationDefinition.getInputDescriptors(), presentationDefinition.getName(),presentationDefinition.getPurpose(),presentationDefinition.getFormat(), presentationDefinition.getSubmissionRequirements()))
                .orElse(null);
    }
}