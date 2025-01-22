package io.inji.verify.services;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;

public interface VPDefinitionService {

    VPDefinitionResponseDto getPresentationDefinition(String id);
}
