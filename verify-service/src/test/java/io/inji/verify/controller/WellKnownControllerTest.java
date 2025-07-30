package io.inji.verify.controller;

import io.inji.verify.key.Extractor;
import io.inji.verify.utils.DIDDocumentUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.security.KeyPair;
import java.security.spec.NamedParameterSpec;
import java.security.KeyPairGenerator;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WellKnownController.class)
class WellKnownControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Extractor mockExtractor;

    @Autowired
    private ApplicationContext applicationContext;

    private String testIssuerURI = "did:example:test-issuer";
    private String testIssuerPublicKeyURI = "did:example:test-issuer#key-0";

    // @BeforeEach
    // void setUp() {
    //     WellKnownController controller = applicationContext.getBean(WellKnownController.class);

    //     ReflectionTestUtils.setField(controller, "issuerURI", testIssuerURI);
    //     ReflectionTestUtils.setField(controller, "issuerPublicKeyURI", testIssuerPublicKeyURI);
    // }

    // @Test
    // @DisplayName("Should return DID Document for /did.json with application/did+json")
    // void wellKnown_Success() throws Exception {
    //     KeyPairGenerator kpg = KeyPairGenerator.getInstance("EdDSA");
    //     kpg.initialize(new NamedParameterSpec("Ed25519"));
    //     KeyPair mockKeyPair = kpg.generateKeyPair();

    //     Map<String, Object> expectedDidDocument = new HashMap<>();
    //     expectedDidDocument.put("@context", Collections.singletonList("https://www.w3.org/ns/did/v1"));
    //     expectedDidDocument.put("id", testIssuerURI);
    //     Map<String, Object> verificationMethod = new HashMap<>();
    //     verificationMethod.put("id", testIssuerPublicKeyURI);
    //     verificationMethod.put("type", "Ed25519VerificationKey2020");
    //     expectedDidDocument.put("verificationMethod", Collections.singletonList(verificationMethod));

    //     when(mockExtractor.extractKeyPair()).thenReturn(mockKeyPair);

    //     try (MockedStatic<DIDDocumentUtil> mockedDidDocumentUtil = Mockito.mockStatic(DIDDocumentUtil.class)) {
    //         mockedDidDocumentUtil.when(() -> DIDDocumentUtil.generateDIDDocument(
    //                         eq(mockKeyPair.getPublic()), eq(testIssuerURI), eq(testIssuerPublicKeyURI)))
    //                 .thenReturn(expectedDidDocument);

    //         mockMvc.perform(get("/did.json")
    //                         .accept(MediaType.valueOf("application/json")))
    //                 .andExpect(status().isOk())
    //                 .andExpect(content().contentType("application/json"))
    //                 .andExpect(jsonPath("$.id").value(testIssuerURI))
    //                 .andExpect(jsonPath("$['@context'][0]").value("https://www.w3.org/ns/did/v1"))
    //                 .andExpect(jsonPath("$.verificationMethod[0].id").value(testIssuerPublicKeyURI));

    //         verify(mockExtractor, times(1)).extractKeyPair();
    //         mockedDidDocumentUtil.verify(() -> DIDDocumentUtil.generateDIDDocument(
    //                 eq(mockKeyPair.getPublic()), eq(testIssuerURI), eq(testIssuerPublicKeyURI)), times(1));
    //     }
    // }

    // @Test
    // @DisplayName("Should return error")
    // void wellKnown_Error() throws Exception {
    //     when(mockExtractor.extractKeyPair()).thenThrow(new RuntimeException("Key extraction failed"));

    //     mockMvc.perform(get("/did.json"))
    //             .andExpect(status().isInternalServerError());
    // }
}