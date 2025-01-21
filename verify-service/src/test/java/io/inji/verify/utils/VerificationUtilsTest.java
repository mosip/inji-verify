package io.inji.verify.utils;

import io.inji.verify.shared.Constants;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class VerificationUtilsTest {

    @Test
    public void shouldVerifyRsaSignature2018Success() throws Exception {
        // Create mock objects
        JSONObject proofObject = Mockito.mock(JSONObject.class);
        String pemString = """
                -----BEGIN PUBLIC KEY-----
                MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
                4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
                +qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
                kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
                0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
                cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
                mwIDAQAB
                -----END PUBLIC KEY-----""";
        Mockito.when(proofObject.getString(Constants.KEY_VERIFICATION_METHOD)).thenReturn(pemString);
        Mockito.when(proofObject.getString(Constants.KEY_JWS)).thenReturn("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ");

        VerificationUtils.verifyRsaSignature2018(proofObject);
    }

    @Test
    public void shouldNotVerifyRsaSignature2018WithInvalidSignature() throws Exception {
        // Create mock objects
        JSONObject proofObject = Mockito.mock(JSONObject.class);
        String pemString = """
                -----BEGIN PUBLIC KEY-----
                MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+25o9ca5c1c7abf2a099f31902e925
                86340eeac040611a68369118e1f26e0d24e8c913a25c9a09e23066b57b99d82
                16dbe5ac3a773f606724e3a7EAQIDAQAB
                -----END PUBLIC KEY-----
                """;

        Mockito.when(proofObject.getString(Constants.KEY_VERIFICATION_METHOD)).thenReturn(pemString);
        Mockito.when(proofObject.getString(Constants.KEY_JWS)).thenReturn("invalid.jws");

        assertThrows(InvalidKeySpecException.class, () -> VerificationUtils.verifyRsaSignature2018(proofObject));
    }

    @Test
    public void shouldNotVerifyEd25519SignatureWithInvalidSignature() throws Exception {
        JSONObject proofObject = Mockito.mock(JSONObject.class);
        Mockito.when(proofObject.getString(Constants.KEY_JWS)).thenReturn("invalid.jws");

        assertThrows(java.text.ParseException.class, () -> VerificationUtils.verifyEd25519Signature(proofObject));
    }
}