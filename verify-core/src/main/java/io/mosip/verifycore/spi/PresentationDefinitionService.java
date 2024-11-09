package io.mosip.verifycore.spi;

import io.mosip.verifycore.models.PresentationDefinition;

public interface PresentationDefinitionService {

    PresentationDefinition getPresentationDefinition(String id);
}
