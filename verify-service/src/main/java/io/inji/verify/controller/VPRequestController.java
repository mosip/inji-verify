package io.inji.verify.controller;

import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
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
    public ResponseEntity<VPRequestResponseDto> createVPRequest(@Valid @RequestBody VPRequestCreateDto vpRequestCreate) {
        if (vpRequestCreate.getPresentationDefinitionId() == null && vpRequestCreate.getPresentationDefinition() == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VPRequestResponseDto(null,null,null,null, ErrorCode.ERR_200, Constants.ERR_200));
        }
        try{
            VPRequestResponseDto authorizationRequestResponse = verifiablePresentationRequestService.createAuthorizationRequest(vpRequestCreate);
            return new ResponseEntity<>(authorizationRequestResponse, HttpStatus.CREATED);
        }catch (PresentationDefinitionNotFoundException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new VPRequestResponseDto(null,null,null,null, ErrorCode.ERR_201, Constants.ERR_201));
        }
    }

    @GetMapping(path = "/{requestId}/status")
    public DeferredResult<VPRequestStatusDto> getStatus(@PathVariable String requestId) {
        DeferredResult<VPRequestStatusDto> result = new DeferredResult<>(Constants.LONG_POLL_TIMEOUT, "Request timeout");
        verifiablePresentationRequestService.getCurrentRequestStatusPeriodic(requestId,result,null);

        return result;
    }

}
