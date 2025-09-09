package io.inji.verify.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.shaded.gson.Gson;

import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.submission.PresentationSubmissionDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import io.inji.verify.shared.Constants;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = Constants.RESPONSE_SUBMISSION_URI_ROOT)
@Slf4j
public class VPSubmissionController {

    final VerifiablePresentationRequestService verifiablePresentationRequestService;

    final VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    final Gson gson;

    public VPSubmissionController(VerifiablePresentationRequestService verifiablePresentationRequestService, VerifiablePresentationSubmissionService verifiablePresentationSubmissionService, Gson gson) {
        this.verifiablePresentationRequestService = verifiablePresentationRequestService;
        this.verifiablePresentationSubmissionService = verifiablePresentationSubmissionService;
        this.gson = gson;
    }

    @PostMapping(path = Constants.RESPONSE_SUBMISSION_URI, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> submitVP(
            @RequestParam(value = "vp_token", required = false) String vpToken,
            @RequestParam(value = "presentation_submission", required = false) String presentationSubmission,
            @NotNull @NotBlank @RequestParam(value = "state") String state,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String errorDescription) {
        if (!isValidResponse(vpToken, error)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Either 'vp_token' or 'error' must be provided, but not both.");
        }

        PresentationSubmissionDto presentationSubmissionDto = gson.fromJson(presentationSubmission, PresentationSubmissionDto.class);
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<PresentationSubmissionDto>> violations = validator.validate(presentationSubmissionDto);
        if (!violations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(violations.iterator().next().getMessage());
        }
        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto(vpToken, presentationSubmissionDto, state);

        VPRequestStatusDto currentVPRequestStatusDto = verifiablePresentationRequestService.getCurrentRequestStatus(vpSubmissionDto.getState());
        if (currentVPRequestStatusDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        verifiablePresentationSubmissionService.submit(vpSubmissionDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private static boolean isValidResponse(String vpToken, String error) {
        return vpToken != null ^ error != null;
    }
}