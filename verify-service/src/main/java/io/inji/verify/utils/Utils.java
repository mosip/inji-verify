package io.inji.verify.utils;

import java.util.UUID;

public final class Utils {

    private Utils() {
    }

    public static String generateID(String prefix) {
        return prefix + "_" + UUID.randomUUID();
    }
}
