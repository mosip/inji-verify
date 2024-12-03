package io.mosip.verifycore.utils;

import java.util.UUID;

public class Utils {
    public static String createID(String prefix){
        return prefix+"_"+UUID.randomUUID();
    }
}
