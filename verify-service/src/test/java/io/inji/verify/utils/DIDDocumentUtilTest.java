package io.inji.verify.utils;

import io.inji.verify.exception.DidGenerationException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.EdECPublicKey;
import java.security.Security;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.security.spec.NamedParameterSpec;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;


class DIDDocumentUtilTest {

    private static KeyPair testKeyPair;
    private static final String issuerURI = "did:example:123";
    private static final String issuerPublicKeyURI = "did:example:123#key-1";

    @BeforeAll
    static void setup() throws Exception {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
            System.out.println("Bouncy Castle provider added for tests.");
        }
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EdDSA");
        kpg.initialize(new NamedParameterSpec("Ed25519"));

        testKeyPair = kpg.generateKeyPair();
    }

    @Test
    @DisplayName("Should generate DID Document correctly for Ed25519 public key")
    void generateDIDDocument_Ed25519PublicKey_Success() {
        Map<String, Object> didDocument = DIDDocumentUtil.generateDIDDocument(
                testKeyPair.getPublic(),
                issuerURI,
                issuerPublicKeyURI
        );

        assertNotNull(didDocument);
        assertEquals(issuerURI, didDocument.get("id"));
        assertEquals(Collections.singletonList("https://www.w3.org/ns/did/v1"), didDocument.get("@context"));
        assertTrue(((List<?>) didDocument.get("alsoKnownAs")).isEmpty());
        assertTrue(((List<?>) didDocument.get("service")).isEmpty());
        assertEquals(Collections.singletonList(issuerPublicKeyURI), didDocument.get("authentication"));
        assertEquals(Collections.singletonList(issuerPublicKeyURI), didDocument.get("assertionMethod"));

        List<Map<String, Object>> verificationMethods = (List<Map<String, Object>>) didDocument.get("verificationMethod");
        assertNotNull(verificationMethods);
        assertEquals(1, verificationMethods.size());

        Map<String, Object> vm = verificationMethods.get(0);
        assertEquals(issuerPublicKeyURI, vm.get("id"));
        assertEquals("Ed25519VerificationKey2020", vm.get("type"));
        assertEquals("https://w3id.org/security/suites/ed25519-2020/v1", vm.get("@context"));
        assertEquals(issuerURI, vm.get("controller"));

        String publicKeyMultibase = (String) vm.get("publicKeyMultibase");
        assertNotNull(publicKeyMultibase);
        assertTrue(publicKeyMultibase.startsWith("z"));

    }

    @Test
    @DisplayName("Should throw DidGenerationException on unexpected error in verification method generation")
    void generateDIDDocument_UnexpectedError_ThrowsDidGenerationException() {
        Logger mockLogger = Mockito.mock(Logger.class);
        try (MockedStatic<LoggerFactory> mockedLoggerFactory = Mockito.mockStatic(LoggerFactory.class)) {
            mockedLoggerFactory.when(() -> LoggerFactory.getLogger(DIDDocumentUtil.class))
                    .thenReturn(mockLogger);

            EdECPublicKey malformedEdECPublicKey = Mockito.mock(EdECPublicKey.class);
            Mockito.when(malformedEdECPublicKey.getPoint()).thenThrow(new RuntimeException("Simulated internal key error"));

            Exception exception = assertThrows(DidGenerationException.class, () -> {
                DIDDocumentUtil.generateDIDDocument(malformedEdECPublicKey, issuerURI, issuerPublicKeyURI);
            });

            assertTrue(exception.getMessage().contains("Error while generating DID document."));
        }
    }
}