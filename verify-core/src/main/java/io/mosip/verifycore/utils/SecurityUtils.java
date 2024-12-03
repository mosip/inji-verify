package io.mosip.verifycore.utils;

import io.mosip.verifycore.shared.Constants;
import org.apache.tomcat.util.codec.binary.Base64;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;

public class SecurityUtils {

    public static String generateNonce()
    {
        String dateTimeString = Long.toString(Instant.now().toEpochMilli());
        byte[] nonceByte = dateTimeString.getBytes();
        return Base64.encodeBase64String(nonceByte);
    }

     public static RSAPublicKey getPublicKeyFromString(String pem)  {
         String publicKeyPEM = pem;

         publicKeyPEM = publicKeyPEM
                 .replace("\n", "")
                 .replace("\\n", "")
                 .replace(Constants.PUBLIC_KEY_HEADER, "")
                 .replace(Constants.PUBLIC_KEY_FOOTER, "");
         byte[] encoded = java.util.Base64.getDecoder().decode(publicKeyPEM);
         KeyFactory kf = null;
         try {
             kf = KeyFactory.getInstance("RSA");
         } catch (NoSuchAlgorithmException e) {
             throw new RuntimeException(e);
         }
         try {
             return (RSAPublicKey)kf.generatePublic(new X509EncodedKeySpec(encoded));
         } catch (InvalidKeySpecException e) {
             throw new RuntimeException(e);
         }
     }

     public static String getFormattedJws(String jws){
        return jws
                .replace("\\n","")
                .replace("\n","")
                .replace("==","");
     }

}
