package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;

public interface PresentationDefinitionService {

    PresentationDefinitionDto getPresentationDefinition(String id);
}
