package io.mosip.verifyservice.controller;

import io.mosip.verifycore.dto.submission.SubmissionResultDto;
import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.VpSubmissionResponseDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.enums.SubmissionStatus;
import io.mosip.verifycore.enums.VerificationStatus;
import io.mosip.verifycore.models.VpSubmission;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import io.mosip.verifycore.spi.VerifiablePresentationSubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class VpSubmissionController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @Autowired
    VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @GetMapping(path = "/vp-result/{requestId}")
    public ResponseEntity<SubmissionResultDto> getVpResult(@PathVariable String requestId) {


        String transactionId = verifiablePresentationRequestService.getTransactionIdFor(requestId);
        Status authRequestStatus = verifiablePresentationRequestService.getStatusFor(requestId);
        //check expiry
        // check pending
        //check failed
        if (transactionId.isEmpty() || authRequestStatus != Status.COMPLETED){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VpSubmission submissionResult = verifiablePresentationSubmissionService.getSubmissionResult(requestId);
        if (submissionResult != null)
        {
            return new ResponseEntity<>(new SubmissionResultDto(transactionId,submissionResult.getVpToken(),SubmissionStatus.ACCEPTED, VerificationStatus.SUCCESS), HttpStatus.OK);
        }
        return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/vp-direct-post")
    public ResponseEntity<VpSubmissionResponseDto> submitVp(@Valid @RequestBody VpSubmissionDto vpSubmissionDto){
        //check state
        Status authRequestStatus = verifiablePresentationRequestService.getStatusFor(vpSubmissionDto.getState());
        if (authRequestStatus== null){
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        //check expiry
        if (authRequestStatus == Status.EXPIRED) {
            VpSubmissionResponseDto expiredVpSubmissionResponseDto = new VpSubmissionResponseDto(SubmissionStatus.REJECTED, "", "ERR_SESSION_EXPIRED", "VP submission request expired already");
            new ResponseEntity<>(expiredVpSubmissionResponseDto,HttpStatus.NOT_ACCEPTABLE);
        }
        //process
        return new ResponseEntity<>(verifiablePresentationSubmissionService.submit(vpSubmissionDto),HttpStatus.OK);
    }
}
