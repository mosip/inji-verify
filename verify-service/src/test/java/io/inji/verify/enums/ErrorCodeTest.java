package io.inji.verify.enums;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class ErrorCodeTest {

    @Test
    public void testValues() {
        ErrorCode[] expectedValues = {ErrorCode.ERR_100, ErrorCode.ERR_101,ErrorCode.ERR_102,ErrorCode.ERR_200,ErrorCode.ERR_201};
        assertArrayEquals(expectedValues, ErrorCode.values());
    }
}