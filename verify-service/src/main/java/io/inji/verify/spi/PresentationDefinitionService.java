package io.inji.verify.spi;

import io.inji.verify.dto.presentation.PresentationDefinitionDto;

public interface PresentationDefinitionService {

    PresentationDefinitionDto getPresentationDefinition(String id);
}
