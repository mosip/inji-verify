package io.mosip.verifyservice.controller;

import com.nimbusds.jose.shaded.gson.Gson;
import io.mosip.verifycore.dto.submission.*;
import io.mosip.verifycore.enums.SubmissionState;
import io.mosip.verifycore.models.VpTokenResult;
import io.mosip.verifycore.shared.Constants;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import io.mosip.verifycore.spi.VerifiablePresentationSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class VpSubmissionController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @Autowired
    VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @GetMapping(path = "/vp-result/{transactionId}")
    public ResponseEntity<VpTokenResultDto> getVpResult(@PathVariable String transactionId) {
        String requestId = verifiablePresentationRequestService.getStatusForRequestIdFor(transactionId);
        SubmissionState authRequestState = verifiablePresentationRequestService.getCurrentSubmissionStateFor(requestId);

        if (transactionId.isEmpty() || authRequestState != SubmissionState.COMPLETED) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VpTokenResultDto result = verifiablePresentationSubmissionService.getSubmissionResult(requestId,transactionId);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = Constants.RESPONSE_SUBMISSION_URI, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<VpSubmissionResponseDto> submitVp(@RequestParam(value = "vp_token") String vpToken, @RequestParam(value = "presentation_submission") String presentationSubmission, @RequestParam(value = "state") String state) {
        PresentationSubmissionDto presentationSubmissionDto = new Gson().fromJson(presentationSubmission, PresentationSubmissionDto.class);
        VpSubmissionDto vpSubmissionDto = new VpSubmissionDto(vpToken, presentationSubmissionDto, state);
        System.out.println(vpSubmissionDto);

        SubmissionState authRequestState = verifiablePresentationRequestService.getCurrentSubmissionStateFor(vpSubmissionDto.getState());
        if (authRequestState == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VpSubmissionResponseDto submissionResponseDto = verifiablePresentationSubmissionService.submit(vpSubmissionDto);
        return new ResponseEntity<>(submissionResponseDto, HttpStatus.OK);
    }
}
