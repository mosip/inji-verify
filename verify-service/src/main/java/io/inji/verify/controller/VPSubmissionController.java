package io.inji.verify.controller;

import java.util.Set;

import com.nimbusds.jose.shaded.gson.JsonSyntaxException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import com.nimbusds.jose.shaded.gson.Gson;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.submission.PresentationSubmissionDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import io.inji.verify.shared.Constants;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
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
        // --- 1. Initial response validation ---
        if (!isValidResponse(vpToken, error, presentationSubmission)) {
            String invalidResponseMessage = "Invalid response: either vp_token and presentation_submission must be provided, or error must be provided.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(invalidResponseMessage);
        }

        // --- 2. Check if request present of not ---
        VPRequestStatusDto currentVPRequestStatusDto = verifiablePresentationRequestService.getCurrentRequestStatus(state);
        if (currentVPRequestStatusDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // --- 3. Check if error present ---
        if (error != null) {
            VPSubmissionDto vpSubmissionDto = new VPSubmissionDto(null, null, state, error, errorDescription);
            verifiablePresentationSubmissionService.submit(vpSubmissionDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            // --- 4. Presentation Submission Validation ---
            try {
                PresentationSubmissionDto presentationSubmissionDto = gson.fromJson(presentationSubmission, PresentationSubmissionDto.class);
                Set<ConstraintViolation<PresentationSubmissionDto>> violations = Validation.buildDefaultValidatorFactory().getValidator().validate(presentationSubmissionDto);
                if (!violations.isEmpty()) {
                    String violationMessage = violations.iterator().next().getMessage();
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(violationMessage);
                }

                VPSubmissionDto vpSubmissionDto = new VPSubmissionDto(vpToken, presentationSubmissionDto, state, null, null);
                verifiablePresentationSubmissionService.submit(vpSubmissionDto);
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (JsonSyntaxException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_PRESENTATION_SUBMISSION");
            }
        }
    }

    private boolean isValidResponse(String vpToken, String error, String presentationSubmission) {
        boolean hasVpToken = StringUtils.hasText(vpToken);
        boolean hasSubmission = StringUtils.hasText(presentationSubmission);
        boolean hasError = StringUtils.hasText(error);

        boolean hasValidVpBlock = hasVpToken && hasSubmission && !hasError;

        boolean hasValidErrorBlock = hasError && !hasVpToken && !hasSubmission;

        return hasValidVpBlock || hasValidErrorBlock;
    }

}