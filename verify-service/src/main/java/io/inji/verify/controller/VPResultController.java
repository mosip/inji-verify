package io.inji.verify.controller;

import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.dto.core.ResponseWrapper;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.shared.Constants;
import io.inji.verify.spi.VerifiablePresentationRequestService;
import io.inji.verify.spi.VerifiablePresentationSubmissionService;
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
        ResponseWrapper<VPTokenResultDto> responseWrapper =  new ResponseWrapper<>();
        List<String> requestIds = verifiablePresentationRequestService.getLatestRequestIdFor(transactionId);

        if (requestIds.isEmpty()) {
            responseWrapper.setError(new ErrorDto(ErrorCode.ERR_100, Constants.ERR_100));
        }
        try {
            VPTokenResultDto result = verifiablePresentationSubmissionService.getVPResult(requestIds,transactionId);
            responseWrapper.setResponse(result);
        }catch (VPSubmissionNotFoundException e){
            log.error(e.getMessage());
            responseWrapper.setError(new ErrorDto(ErrorCode.ERR_101, Constants.ERR_101));
        }

        return ResponseEntity.status(HttpStatus.OK).body(responseWrapper);
    }
}