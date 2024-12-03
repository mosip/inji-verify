package io.mosip.verifyservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateResponseDto;
import io.mosip.verifycore.dto.authorizationRequest.StatusResponseDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import jakarta.validation.Valid;

@RequestMapping("/vp-request")
@RestController
@CrossOrigin(origins = "*")
public class VpRequestController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthorizationRequestCreateResponseDto> createVpRequest(@Valid @RequestBody AuthorizationRequestCreateDto vpRequestCreate) {
        if (vpRequestCreate.getPresentationDefinition() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        AuthorizationRequestCreateResponseDto authorizationRequestResponse = verifiablePresentationRequestService.createAuthorizationRequest(vpRequestCreate);
        return new ResponseEntity<>(authorizationRequestResponse, HttpStatus.CREATED);
    }

    @GetMapping(path = "/{requestId}/status")
    public ResponseEntity<StatusResponseDto> getStatus(@PathVariable String requestId) {

        String transactionId = verifiablePresentationRequestService.getTransactionIdFor(requestId);
        Status currentstatus = verifiablePresentationRequestService.getCurrentStatusFor(requestId);
        if (currentstatus == null || transactionId == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(new StatusResponseDto(transactionId, requestId, currentstatus), HttpStatus.OK);
    }
}
