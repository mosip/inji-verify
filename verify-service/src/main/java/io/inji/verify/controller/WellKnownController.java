package io.inji.verify.controller;

import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.key.Extractor;
import io.inji.verify.utils.DIDDocumentUtil;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.KeyPair;

import org.springframework.web.bind.annotation.CrossOrigin;

@RequestMapping
@RestController
@Slf4j
@CrossOrigin(origins = "*")
public class WellKnownController {

    @Value("${inji.did.issuer.uri}")
    String issuerURI;

    @Value("${inji.did.issuer.public.key.uri}")
    String issuerPublicKeyURI;

    Extractor extractor;

    public WellKnownController(Extractor extractor) {
        this.extractor = extractor;
    }

    @GetMapping(path = "/did.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> wellKnown() {

        try {
            KeyPair keyPair = extractor.extractKeyPair();
            // return ResponseEntity
            //         .status(HttpStatus.OK)
            //         .body(DIDDocumentUtil.generateDIDDocument(keyPair.getPublic(), issuerURI, issuerPublicKeyURI));
            return ResponseEntity.ok("""
        {
          "@context": "https://www.w3.org/ns/did/v1",
          "id": "did:web:injiverify.dev-int-inji.mosip.net:v1:verify",
          "verificationMethod": [{
            "id": "did:web:injiverify.dev-int-inji.mosip.net:v1:verify#key-1",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:web:injiverify.dev-int-inji.mosip.net:v1:verify",
            "publicKeyBase58": "..."
          }],
          "authentication": ["did:web:injiverify.dev-int-inji.mosip.net:v1:verify#key-1"]
        }
        """);
        } catch (Exception e) {
            log.error("Error extracting KeyPair: {}", e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto(ErrorCode.DID_CREATION_FAILED));
    }
}
