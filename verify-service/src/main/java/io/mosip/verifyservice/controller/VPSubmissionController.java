package io.mosip.verifyservice.controller;

import io.mosip.verifycore.dto.submission.PresentationSubmissionDto;
import io.mosip.verifycore.dto.submission.ResponseAcknowledgementDto;
import io.mosip.verifycore.dto.submission.VPSubmissionDto;
import io.mosip.verifycore.dto.submission.VPTokenResultDto;
import io.mosip.verifycore.enums.SubmissionState;
import io.mosip.verifycore.shared.Constants;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import io.mosip.verifycore.spi.VerifiablePresentationSubmissionService;
import io.mosip.verifyservice.singletons.GsonSingleton;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class VPSubmissionController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @Autowired
    VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @Autowired
    GsonSingleton gsonSingleton;

    @GetMapping(path = "/vp-result/{transactionId}")
    public ResponseEntity<VPTokenResultDto> getVPResult(@PathVariable String transactionId) {
        String requestId = verifiablePresentationRequestService.getLatestRequestIdFor(transactionId);
        SubmissionState authRequestState = verifiablePresentationRequestService.getCurrentAuthorizationRequestStateFor(requestId);

        if (transactionId.isEmpty() || authRequestState != SubmissionState.COMPLETED) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VPTokenResultDto result = verifiablePresentationSubmissionService.getVPResult(requestId,transactionId);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = Constants.RESPONSE_SUBMISSION_URI, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<ResponseAcknowledgementDto> submitVP(@RequestParam(value = "vp_token") String vpToken, @RequestParam(value = "presentation_submission") String presentationSubmission, @RequestParam(value = "state") String state) {
        PresentationSubmissionDto presentationSubmissionDto = gsonSingleton.getInstance().fromJson(presentationSubmission, PresentationSubmissionDto.class);
        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto(vpToken, presentationSubmissionDto, state);
        verifiablePresentationSubmissionService.submit(vpSubmissionDto);

        SubmissionState authRequestState = verifiablePresentationRequestService.getCurrentAuthorizationRequestStateFor(vpSubmissionDto.getState());
        if (authRequestState == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ResponseAcknowledgementDto submissionResponseDto = verifiablePresentationSubmissionService.submit(vpSubmissionDto);
        return new ResponseEntity<>(submissionResponseDto, HttpStatus.OK);
    }
}
