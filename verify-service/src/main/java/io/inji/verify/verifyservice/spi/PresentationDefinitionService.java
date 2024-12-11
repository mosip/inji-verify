package io.inji.verify.verifyservice.spi;

import io.inji.verify.verifyservice.dto.presentation.PresentationDefinitionDto;

public interface PresentationDefinitionService {

    PresentationDefinitionDto getPresentationDefinition(String id);
}
