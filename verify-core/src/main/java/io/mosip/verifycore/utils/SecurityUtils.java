package io.mosip.verifycore.utils;

import io.mosip.verifycore.shared.Constants;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;

public class SecurityUtils {

    public static String generateNonce()
    {
        SecureRandom random = new SecureRandom();
        byte[] randomBytes = new byte[16];
        random.nextBytes(randomBytes);
        StringBuilder hexString = new StringBuilder();
        for (byte b : randomBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
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