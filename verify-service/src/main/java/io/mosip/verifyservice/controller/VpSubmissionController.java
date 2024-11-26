package io.mosip.verifyservice.controller;

import com.nimbusds.jose.shaded.gson.Gson;
import io.mosip.verifycore.dto.submission.PresentationSubmissionDto;
import io.mosip.verifycore.dto.submission.SubmissionResultDto;
import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.VpSubmissionResponseDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.models.VpSubmission;
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
    public ResponseEntity<SubmissionResultDto> getVpResult(@PathVariable String transactionId) {
        String requestId = verifiablePresentationRequestService.getStatusForRequestIdFor(transactionId);
        Status authRequestStatus = verifiablePresentationRequestService.getStatusFor(requestId);

        if (transactionId.isEmpty() || authRequestStatus != Status.COMPLETED) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VpSubmission submissionResult = verifiablePresentationSubmissionService.getSubmissionResult(requestId);
        if (submissionResult != null) {
            return new ResponseEntity<>(new SubmissionResultDto(transactionId, submissionResult.getVpToken(), submissionResult.getVerificationStatus()), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/vp-direct-post", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<VpSubmissionResponseDto> submitVp(@RequestParam(value = "vp_token") String vpToken, @RequestParam(value = "presentation_submission") String presentationSubmission, @RequestParam(value = "state") String state) {
        PresentationSubmissionDto presentationSubmissionDto = new Gson().fromJson(presentationSubmission, PresentationSubmissionDto.class);
        VpSubmissionDto vpSubmissionDto = new VpSubmissionDto(vpToken, presentationSubmissionDto, state);
        System.out.println(vpSubmissionDto);

        Status authRequestStatus = verifiablePresentationRequestService.getStatusFor(vpSubmissionDto.getState());
        if (authRequestStatus == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VpSubmissionResponseDto submissionResponseDto = verifiablePresentationSubmissionService.submit(vpSubmissionDto);
        return new ResponseEntity<>(submissionResponseDto, HttpStatus.OK);
    }
}
