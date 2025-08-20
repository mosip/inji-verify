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
public class DidWebController {

    @Value("${inji.did.verify.uri}")
    String issuerURI;

    @Value("${inji.did.verify.public.key.uri}")
    String issuerPublicKeyURI;

    Extractor extractor;

    public DidWebController(Extractor extractor) {
        this.extractor = extractor;
    }

    @GetMapping(path = "/did.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> generateDid() {

        try {
            KeyPair keyPair = extractor.extractKeyPair();
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(DIDDocumentUtil.generateDIDDocument(keyPair.getPublic(), issuerURI, issuerPublicKeyURI));

        } catch (Exception e) {
            log.error("Error extracting KeyPair: {}", e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto(ErrorCode.DID_CREATION_FAILED));
    }
}
