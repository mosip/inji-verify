package io.inji.verify.verifyservice.controller;

import io.inji.verify.verifyservice.dto.authorizationRequest.VPRequestCreateDto;
import io.inji.verify.verifyservice.dto.authorizationRequest.VPRequestResponseDto;
import io.inji.verify.verifyservice.dto.authorizationRequest.StatusDto;
import io.inji.verify.verifyservice.enums.SubmissionState;
import io.inji.verify.verifyservice.spi.VerifiablePresentationRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/vp-request")
@RestController
public class VPRequestController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<VPRequestResponseDto> createVPRequest(@Valid @RequestBody VPRequestCreateDto vpRequestCreate) {
        if (vpRequestCreate.getPresentationDefinition() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        VPRequestResponseDto authorizationRequestResponse = verifiablePresentationRequestService.createAuthorizationRequest(vpRequestCreate);
        return new ResponseEntity<>(authorizationRequestResponse, HttpStatus.CREATED);
    }

    @GetMapping(path = "/{requestId}/status")
    public ResponseEntity<StatusDto> getStatus(@PathVariable String requestId) {

        String transactionId = verifiablePresentationRequestService.getTransactionIdFor(requestId);
        SubmissionState currentSubmissionState = verifiablePresentationRequestService.getCurrentAuthorizationRequestStateFor(requestId);
        if (currentSubmissionState == null || transactionId == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(new StatusDto(transactionId, requestId, currentSubmissionState), HttpStatus.OK);
    }
}
