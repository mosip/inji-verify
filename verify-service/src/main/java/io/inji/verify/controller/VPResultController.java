package io.inji.verify.controller;

import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.shared.Constants;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class VPResultController {
    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @Autowired
    VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @GetMapping(path = "/vp-result/{transactionId}")
    public ResponseEntity<Object> getVPResult(@PathVariable String transactionId) {
        List<String> requestIds = verifiablePresentationRequestService.getLatestRequestIdFor(transactionId);

        if (!requestIds.isEmpty()) {
            try {
                VPTokenResultDto result = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);
                return ResponseEntity.status(HttpStatus.OK).body(result);
            } catch (VPSubmissionNotFoundException e) {
                log.error(e.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorDto(ErrorCode.NO_VP_SUBMISSION));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorDto(ErrorCode.INVALID_TRANSACTION_ID));
    }
}