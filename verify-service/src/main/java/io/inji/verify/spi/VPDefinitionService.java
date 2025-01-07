package io.inji.verify.spi;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;

public interface VPDefinitionService {

    VPDefinitionResponseDto getPresentationDefinition(String id);
}
