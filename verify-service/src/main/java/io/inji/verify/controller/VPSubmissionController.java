package io.inji.verify.controller;

import java.util.Optional;
import java.util.Set;
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
        if (!isValidResponse(vpToken, error, presentationSubmission)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid response: either vp_token and presentation_submission must be provided, or error must be provided.");
        }

        Optional<PresentationSubmissionDto> presentationSubmissionDto =
                Optional.ofNullable(presentationSubmission).map(submission -> gson.fromJson(submission, PresentationSubmissionDto.class));

        PresentationSubmissionDto submissionDto = presentationSubmissionDto.orElse(null);

        if (presentationSubmissionDto.isPresent()) {
            Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
            Set<ConstraintViolation<PresentationSubmissionDto>> violations = validator.validate(submissionDto);
            if (!violations.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(violations.iterator().next().getMessage());
            }
        }

        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto(vpToken, submissionDto, state, error, errorDescription);

        VPRequestStatusDto currentVPRequestStatusDto = verifiablePresentationRequestService.getCurrentRequestStatus(vpSubmissionDto.getState());
        if (currentVPRequestStatusDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        verifiablePresentationSubmissionService.submit(vpSubmissionDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private static boolean isValidResponse(String vpToken, String error, String presentationSubmission) {
        boolean hasVpToken = StringUtils.hasText(vpToken);
        boolean hasSubmission = StringUtils.hasText(presentationSubmission);
        boolean hasError = StringUtils.hasText(error);

        boolean hasValidVpBlock = hasVpToken && hasSubmission && !hasError;

        boolean hasValidErrorBlock = hasError && !hasVpToken && !hasSubmission;

        return hasValidVpBlock || hasValidErrorBlock;
    }

}