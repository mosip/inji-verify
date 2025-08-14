package io.inji.verify.utils;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import org.junit.jupiter.api.function.Executable;


public class UtilsTest {

    @Test
    void coverPrivateConstructor() throws Exception {
        Constructor<Utils> constructor = Utils.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        Executable exec = () -> constructor.newInstance();
        assertDoesNotThrow(exec);
    }
}