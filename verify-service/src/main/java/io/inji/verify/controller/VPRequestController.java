package io.inji.verify.controller;

import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.dto.core.ResponseWrapper;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.shared.Constants;
import io.inji.verify.spi.VerifiablePresentationRequestService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

@RequestMapping("/vp-request")
@RestController
@Slf4j
public class VPRequestController {

    @Autowired
    VerifiablePresentationRequestService verifiablePresentationRequestService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createVPRequest(@Valid @RequestBody VPRequestCreateDto vpRequestCreate) {
        ResponseWrapper<VPRequestResponseDto> responseWrapper = new ResponseWrapper<VPRequestResponseDto>();
        if (vpRequestCreate.getPresentationDefinitionId() == null && vpRequestCreate.getPresentationDefinition() == null){
            responseWrapper.setError(new ErrorDto(ErrorCode.ERR_200, Constants.ERR_200));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseWrapper);
        }
        try{
            VPRequestResponseDto authorizationRequestResponse = verifiablePresentationRequestService.createAuthorizationRequest(vpRequestCreate);
            responseWrapper.setResponse(authorizationRequestResponse);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseWrapper);
        }catch (PresentationDefinitionNotFoundException e){
            log.error(e.getMessage());
            responseWrapper.setError(new ErrorDto(ErrorCode.ERR_201, Constants.ERR_201));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseWrapper);
        }
    }

    @GetMapping(path = "/{requestId}/status")
    public DeferredResult<VPRequestStatusDto> getStatus(@PathVariable String requestId) {
        DeferredResult<VPRequestStatusDto> result = new DeferredResult<>(Constants.LONG_POLL_TIMEOUT, "Request timeout");
        verifiablePresentationRequestService.getCurrentRequestStatusPeriodic(requestId,result,null);

        return result;
    }

}
