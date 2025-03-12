package io.inji.verify.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PresentationDefinitionNotFoundExceptionTest {
    @Test
    void shouldTestConstructor() {
        PresentationDefinitionNotFoundException exception = new PresentationDefinitionNotFoundException();
        assertEquals("No Presentation Definition found for given Presentation Definition ID.", exception.getMessage());
    }
}