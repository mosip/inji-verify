package io.inji.verify.utils;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

public class SecurityUtilsTest {

    @Test
    public void shouldNotGenerateSameNonce() {
        String nonce1 = SecurityUtils.generateNonce();
        String nonce2 = SecurityUtils.generateNonce();

        assertNotEquals(nonce1, nonce2);
        assertEquals(32, nonce1.length());
    }

    @Test
    public void shouldNotReturnNullForValidPublicKey() throws Exception {
        String pemString = "-----BEGIN PUBLIC KEY-----\n" +
                "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyqvyIzBsuGyakCfSN4hw\n"+
                "Ozh+vGbq5ZExpS5qPRi6Lpns3Bx+AgUGAM4OfY9DOt8VuFNLmwbsjJt+WuyqAu1a\n"+
                "GIwWyRWjcszDsyorRtSGDzCVLspk9AH3Dp0QPO1eIlzQD69iWlMUZayre1S1b/IK\n"+
                "maCkFxpfDqS+fF8Sm9hp3OLjUsXH9/o2aGkuo1YspbyuWlcj4jaSYrZZ8szKhQqk\n"+
                "r+Hl6bS6uUuoKWKENQGP7HJMChM29ITnrDCf9ZdpLW5h/q2656ST20+wRHfOwNuT\n"+
                "Q8tqKn8P0B00vto8bEhadIpj53efNTTMmP6fnLhFEX+xOWVp4lJi8qM4Y0UMbbnx\n"+
                "ewIDAQAB\n"+
                "-----END PUBLIC KEY-----";

        RSAPublicKey publicKey = SecurityUtils.readX509PublicKey(pemString);

        assertNotNull(publicKey);
    }
}