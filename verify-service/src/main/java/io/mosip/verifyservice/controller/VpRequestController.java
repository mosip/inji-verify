package io.mosip.verifyservice.controller;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateResponseDto;
import io.mosip.verifycore.dto.authorizationRequest.StatusResponseDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import io.mosip.verifycore.utils.Utils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/vp-request")
@RestController
public class VpRequestController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthorizationRequestCreateResponseDto> createVpRequest(@Valid @RequestBody AuthorizationRequestCreateDto vpRequestCreate, HttpServletRequest request) {
        if (vpRequestCreate.getPresentationDefinition() == null && vpRequestCreate.getVerificationType() == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
//        if (vpRequestCreate.verificationType()!=null)
//            // create a definition
//            PresentationDefinition presentationDefinition = presentationDefinitionService.getPresentationDefinition(vpRequestCreate.verificationType());
//            //create auth REQ
        //else
        if (vpRequestCreate.getPresentationDefinition() != null) {
            AuthorizationRequestCreateResponseDto authorizationRequestResponse = verifiablePresentationRequestService.createAuthorizationRequest(vpRequestCreate, Utils.getServerAddress(request));
            return new ResponseEntity<>(authorizationRequestResponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }

    @GetMapping(path = "/{requestId}/status")
    public ResponseEntity<StatusResponseDto> getStatus(@PathVariable String requestId) {

        String transactionId = verifiablePresentationRequestService.getTransactionIdFor(requestId);
        Status currentstatus = verifiablePresentationRequestService.getStatusFor(requestId);
        if (currentstatus == null || transactionId == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(new StatusResponseDto(transactionId, requestId, currentstatus), HttpStatus.OK);
    }
}
