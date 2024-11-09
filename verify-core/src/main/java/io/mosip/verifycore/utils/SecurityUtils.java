package io.mosip.verifycore.utils;

import org.apache.tomcat.util.codec.binary.Base64;
import java.time.Instant;

 public class SecurityUtils {

    public static String generateNonce()
    {
        String dateTimeString = Long.toString(Instant.now().toEpochMilli());
        byte[] nonceByte = dateTimeString.getBytes();
        return Base64.encodeBase64String(nonceByte);
    }
}
