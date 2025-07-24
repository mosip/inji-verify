package io.inji.verify.services.impl;

import io.inji.verify.config.RedisConfigProperties;
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
    private final RedisConfigProperties redisConfigProperties;

    public VPDefinitionServiceImpl(PresentationDefinitionRepository presentationDefinitionRepository,
                                   RedisConfigProperties redisConfigProperties) {
        this.presentationDefinitionRepository = presentationDefinitionRepository;
        this.redisConfigProperties = redisConfigProperties;
    }

    @Override
    @Cacheable(value = "presentationDefinitionCache",
            key = "#id",
            condition = "@redisConfigProperties.presentationDefinitionCacheEnabled")
    public VPDefinitionResponseDto getPresentationDefinition(String id) {
        if (!redisConfigProperties.isPresentationDefinitionPersisted()) {
            log.debug("Redis cache is disabled for presentation definitions.");
            return null;
        }

        return presentationDefinitionRepository.findById(id)
                .map(presentationDefinition ->  new VPDefinitionResponseDto(presentationDefinition.getId(), presentationDefinition.getInputDescriptors(), presentationDefinition.getName(),presentationDefinition.getPurpose(),presentationDefinition.getFormat(), presentationDefinition.getSubmissionRequirements()))
                .orElse(null);
    }
}