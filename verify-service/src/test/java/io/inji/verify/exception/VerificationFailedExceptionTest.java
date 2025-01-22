package io.inji.verify.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class VerificationFailedExceptionTest {

    @Test
    void shouldTestConstructor() {
        VerificationFailedException exception = new VerificationFailedException();
        assertEquals("Verification Failed", exception.getMessage());
    }
}
