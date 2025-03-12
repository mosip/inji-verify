package io.inji.verify.dto.core;

import io.inji.verify.enums.ErrorCode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ErrorDtoTest {
    @Test
    public void shouldTestConstructor() {
        String message = "testMessage";

        ErrorDto errorDto = new ErrorDto(ErrorCode.ERR_100, message);

        assertEquals(ErrorCode.ERR_100, errorDto.getErrorCode());
        assertEquals(message, errorDto.getErrorMessage());
    }

}