package io.inji.verify.enums;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class ErrorCodeTest {

    @Test
    public void testValues() {
        ErrorCode[] expectedValues = {ErrorCode.ERR_100, ErrorCode.ERR_101};
        assertArrayEquals(expectedValues, ErrorCode.values());
    }
}