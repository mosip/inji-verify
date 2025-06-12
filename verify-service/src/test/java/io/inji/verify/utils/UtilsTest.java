package io.inji.verify.utils;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class UtilsTest {

    @Test
    public void shouldGenerateIDWithGivenPrefix() {
        String prefix = "TEST_";
        String id = Utils.generateID(prefix);

        assertTrue(id.startsWith(prefix));
        // Assert that the generated ID contains a UUID
        assertTrue(id.contains("-"));
    }
}