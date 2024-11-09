package io.mosip.verifycore.utils;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

public class Utils {
    public static String createID(String prefix){
        return prefix+"_"+UUID.randomUUID();
    }

    public static String getServerAddress(HttpServletRequest request) {
        return request.getRequestURL().toString().replaceAll(request.getServletPath(),"");
    }
}
