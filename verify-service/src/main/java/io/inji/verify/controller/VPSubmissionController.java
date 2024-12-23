package io.inji.verify.controller;

import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.submission.PresentationSubmissionDto;
import io.inji.verify.dto.submission.ResponseAcknowledgementDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.shared.Constants;
import io.inji.verify.spi.VerifiablePresentationRequestService;
import io.inji.verify.spi.VerifiablePresentationSubmissionService;
import io.inji.verify.singletons.GsonSingleton;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        List<String> requestIds = verifiablePresentationRequestService.getLatestRequestIdFor(transactionId);

        if (requestIds.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        VPTokenResultDto result = verifiablePresentationSubmissionService.getVPResult(requestIds,transactionId);
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

        VPRequestStatusDto currentVPRequestStatusDto = verifiablePresentationRequestService.getCurrentRequestStatus(vpSubmissionDto.getState());
        if (currentVPRequestStatusDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ResponseAcknowledgementDto submissionResponseDto = verifiablePresentationSubmissionService.submit(vpSubmissionDto);
        return new ResponseEntity<>(submissionResponseDto, HttpStatus.OK);
    }
}
