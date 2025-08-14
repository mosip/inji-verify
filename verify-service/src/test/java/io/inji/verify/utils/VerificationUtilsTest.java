package io.inji.verify.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.Ed25519Signer;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jose.jwk.gen.OctetKeyPairGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.inji.verify.shared.Constants;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;

class VerificationUtilsTest {

    private static RSAPublicKey rsaPublicKey;
    private static RSAPrivateKey rsaPrivateKey;
    private static OctetKeyPair ed25519KeyPair;

    @BeforeAll
    static void setUp() throws Exception {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        KeyPairGenerator rsaKeyGen = KeyPairGenerator.getInstance("RSA");
        rsaKeyGen.initialize(2048);
        KeyPair rsaKeyPair = rsaKeyGen.generateKeyPair();
        rsaPublicKey = (RSAPublicKey) rsaKeyPair.getPublic();
        rsaPrivateKey = (RSAPrivateKey) rsaKeyPair.getPrivate();

        ed25519KeyPair = new OctetKeyPairGenerator(com.nimbusds.jose.jwk.Curve.Ed25519)
                .keyID("test-key-id")
                .generate();
    }

    @Test
    @DisplayName("Should successfully verify valid RSA signature")
    void verifyRsaSignature2018_ValidSignature_Success() throws Exception {
        Algorithm algorithm = Algorithm.RSA256(rsaPublicKey, rsaPrivateKey);
        String jwt = JWT.create()
                .withSubject("test")
                .withIssuer("test-issuer")
                .withExpiresAt(Date.from(Instant.now().plusSeconds(3600)))
                .sign(algorithm);

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_VERIFICATION_METHOD, "test-public-key-pem");
        proofObject.put(Constants.KEY_JWS, jwt);

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = Mockito.mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(() -> SecurityUtils.readX509PublicKey(anyString()))
                    .thenReturn(rsaPublicKey);

            assertDoesNotThrow(() -> {
                VerificationUtils.verifyRsaSignature2018(proofObject);
            });
        }
    }

    @Test
    @DisplayName("Should throw exception for invalid RSA signature")
    void verifyRsaSignature2018_InvalidSignature_ThrowsException() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair differentKeyPair = keyGen.generateKeyPair();

        Algorithm signAlgorithm = Algorithm.RSA256(null, (RSAPrivateKey) differentKeyPair.getPrivate());
        String jwt = JWT.create()
                .withSubject("test")
                .withIssuer("test-issuer")
                .withExpiresAt(Date.from(Instant.now().plusSeconds(3600)))
                .sign(signAlgorithm);

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_VERIFICATION_METHOD, "test-public-key-pem");
        proofObject.put(Constants.KEY_JWS, jwt);

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = Mockito.mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(() -> SecurityUtils.readX509PublicKey(anyString()))
                    .thenReturn(rsaPublicKey);

            assertThrows(JWTVerificationException.class, () -> {
                VerificationUtils.verifyRsaSignature2018(proofObject);
            });
        }
    }

    @Test
    @DisplayName("Should handle JWT with newlines in RSA verification")
    void verifyRsaSignature2018_JwtWithNewlines_Success() throws Exception {
        Algorithm algorithm = Algorithm.RSA256(rsaPublicKey, rsaPrivateKey);
        String jwt = JWT.create()
                .withSubject("test")
                .withIssuer("test-issuer")
                .withExpiresAt(Date.from(Instant.now().plusSeconds(3600)))
                .sign(algorithm);

        String jwtWithNewlines = jwt.substring(0, 10) + "\n" + jwt.substring(10, 20) + "\n" + jwt.substring(20);

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_VERIFICATION_METHOD, "test-public-key-pem");
        proofObject.put(Constants.KEY_JWS, jwtWithNewlines);

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = Mockito.mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(() -> SecurityUtils.readX509PublicKey(anyString()))
                    .thenReturn(rsaPublicKey);

            assertDoesNotThrow(() -> {
                VerificationUtils.verifyRsaSignature2018(proofObject);
            });
        }
    }

    @Test
    @DisplayName("Should throw exception when SecurityUtils throws exception")
    void verifyRsaSignature2018_SecurityUtilsThrowsException_PropagatesException() {
        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_VERIFICATION_METHOD, "invalid-pem");
        proofObject.put(Constants.KEY_JWS, "test.jwt.token");

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = Mockito.mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(() -> SecurityUtils.readX509PublicKey(anyString()))
                    .thenThrow(new RuntimeException("Failed to read public key"));

            assertThrows(Exception.class, () -> {
                VerificationUtils.verifyRsaSignature2018(proofObject);
            });
        }
    }

    @Test
    @DisplayName("Should successfully verify valid Ed25519 signature")
    void verifyEd25519Signature_ValidSignature_Success() throws Exception {
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject("test")
                .issuer("test-issuer")
                .expirationTime(Date.from(Instant.now().plusSeconds(3600)))
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.EdDSA)
                .jwk(ed25519KeyPair.toPublicJWK())
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);

        JWSSigner signer = new Ed25519Signer(ed25519KeyPair);
        signedJWT.sign(signer);

        String jwt = signedJWT.serialize();

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_JWS, jwt);

        assertDoesNotThrow(() -> {
            VerificationUtils.verifyEd25519Signature(proofObject);
        });
    }

    @Test
    @DisplayName("Should handle JWT with newlines in Ed25519 verification")
    void verifyEd25519Signature_JwtWithNewlines_Success() throws Exception {
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject("test")
                .issuer("test-issuer")
                .expirationTime(Date.from(Instant.now().plusSeconds(3600)))
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.EdDSA)
                .jwk(ed25519KeyPair.toPublicJWK())
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        JWSSigner signer = new Ed25519Signer(ed25519KeyPair);
        signedJWT.sign(signer);

        String jwt = signedJWT.serialize();
        String jwtWithNewlines = jwt.substring(0, 10) + "\n" + jwt.substring(10, 20) + "\n" + jwt.substring(20);

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_JWS, jwtWithNewlines);

        assertDoesNotThrow(() -> {
            VerificationUtils.verifyEd25519Signature(proofObject);
        });
    }

    @Test
    @DisplayName("Should throw ParseException for malformed JWT in Ed25519 verification")
    void verifyEd25519Signature_MalformedJwt_ThrowsParseException() {
        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_JWS, "not.a.valid.jwt.format");

        assertThrows(ParseException.class, () -> {
            VerificationUtils.verifyEd25519Signature(proofObject);
        });
    }

    @Test
    @DisplayName("Should handle Ed25519 signature verification failure")
    void verifyEd25519Signature_InvalidSignature_VerificationFails() throws Exception {
        OctetKeyPair differentKeyPair = new OctetKeyPairGenerator(com.nimbusds.jose.jwk.Curve.Ed25519)
                .keyID("different-key-id")
                .generate();

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject("test")
                .issuer("test-issuer")
                .expirationTime(Date.from(Instant.now().plusSeconds(3600)))
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.EdDSA)
                .jwk(ed25519KeyPair.toPublicJWK())
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);

        JWSSigner signer = new Ed25519Signer(differentKeyPair);
        signedJWT.sign(signer);

        String jwt = signedJWT.serialize();

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_JWS, jwt);

        assertDoesNotThrow(() -> {
            VerificationUtils.verifyEd25519Signature(proofObject);
        });
    }

    @Test
    @DisplayName("Should throw exception when JWK is missing from header")
    void verifyEd25519Signature_MissingJwkInHeader_ThrowsException() throws Exception {
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject("test")
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.EdDSA)
                .keyID("test-key-id")
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        JWSSigner signer = new Ed25519Signer(ed25519KeyPair);
        signedJWT.sign(signer);

        String jwt = signedJWT.serialize();

        JSONObject proofObject = new JSONObject();
        proofObject.put(Constants.KEY_JWS, jwt);

        assertThrows(Exception.class, () -> {
            VerificationUtils.verifyEd25519Signature(proofObject);
        });
    }

    @Test
    @DisplayName("Should throw exception when proof object is missing required keys")
    void verifyRsaSignature2018_MissingKeys_ThrowsException() {
        JSONObject proofObjectMissingVM = new JSONObject();
        proofObjectMissingVM.put(Constants.KEY_JWS, "test.jwt.token");

        assertThrows(Exception.class, () -> {
            VerificationUtils.verifyRsaSignature2018(proofObjectMissingVM);
        });

        JSONObject proofObjectMissingJws = new JSONObject();
        proofObjectMissingJws.put(Constants.KEY_VERIFICATION_METHOD, "test-pem");

        assertThrows(Exception.class, () -> {
            VerificationUtils.verifyRsaSignature2018(proofObjectMissingJws);
        });
    }

    @Test
    @DisplayName("Should throw exception when Ed25519 proof object is missing JWS key")
    void verifyEd25519Signature_MissingJwsKey_ThrowsException() {
        JSONObject proofObject = new JSONObject();

        assertThrows(Exception.class, () -> {
            VerificationUtils.verifyEd25519Signature(proofObject);
        });
    }

    @Test
    @DisplayName("Should handle null proof object gracefully")
    void verifyRsaSignature2018_NullProofObject_ThrowsException() {
        assertThrows(Exception.class, () -> {
            VerificationUtils.verifyRsaSignature2018(null);
        });
    }

    @Test
    @DisplayName("Should handle null proof object in Ed25519 verification")
    void verifyEd25519Signature_NullProofObject_ThrowsException() {
        assertThrows(Exception.class, () -> {
            VerificationUtils.verifyEd25519Signature(null);
        });
    }
}
