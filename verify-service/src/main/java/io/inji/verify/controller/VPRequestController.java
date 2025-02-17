package io.inji.verify.controller;

import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.shared.Constants;
import io.inji.verify.services.VerifiablePresentationRequestService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpServletResponse;


@RequestMapping("/vp-request")
@RestController
@Slf4j
public class VPRequestController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;
    @Value("${default.long-polling-timeout}")
    Long timeOut;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createVPRequest(@Valid @RequestBody VPRequestCreateDto vpRequestCreate) {
        if (vpRequestCreate.getPresentationDefinitionId() == null && vpRequestCreate.getPresentationDefinition() == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto(ErrorCode.ERR_200, Constants.ERR_200));
        }
        try{
            VPRequestResponseDto authorizationRequestResponse = verifiablePresentationRequestService.createAuthorizationRequest(vpRequestCreate);
            return ResponseEntity.status(HttpStatus.CREATED).body(authorizationRequestResponse);
        }catch (PresentationDefinitionNotFoundException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorDto(ErrorCode.ERR_201, Constants.ERR_201));
        }
    }

    @GetMapping(path = "/{requestId}/status")
    public DeferredResult<VPRequestStatusDto> getStatus(HttpServletResponse response, @PathVariable String requestId, @RequestHeader("Request-Time") String requestTime) {
        response.setHeader("Connection", "close");
        log.info("Checking Status with timeout: " + timeOut);
        log.info("Checking Request-Time Header: " + requestTime);
        DeferredResult<VPRequestStatusDto> result = new DeferredResult<>(timeOut);
        result.onTimeout(()->{
            log.info("Timeout occurred");
            result.setErrorResult(ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT).body("requested Timed out"));
        });
        log.info("registerSubmissionListener...");
        verifiablePresentationRequestService.registerSubmissionListener(requestId, result);
        return result;
    }

}
