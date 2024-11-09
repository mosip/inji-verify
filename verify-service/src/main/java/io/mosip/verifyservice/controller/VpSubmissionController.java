package io.mosip.verifyservice.controller;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestResultDto;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VpSubmissionController {

//    @Autowired
//    VerifiablePresentationRequestService verifiablePresentationRequestService;
//
//    @Autowired
//    VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;
//
//    @GetMapping(path = "/vp-result/{requestId}")
//    public ResponseEntity<AuthorizationRequestResultDto> getVpResult(@PathVariable String requestId) {
//
//
//        String transactionId = verifiablePresentationRequestService.getTransactionIdFor(requestId);
//        SubmissionResult submissionResult = VerifiablePresentationSubmissionService.getSumissionResult(requestId);
//        if (transactionId!=null && submissionResult != null)
//        {
//            return new ResponseEntity<>(new SubmissionResultDto(transactionId,submissionResult.verified,submissionResult.claims), HttpStatus.OK);
//        }
//
//        return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
//
//    }
}
