package io.inji.verify.spi;

import io.inji.verify.dto.authorizationRequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationRequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationRequest.VPRequestStatusDto;

import java.util.List;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);

    VPRequestStatusDto getCurrentRequestStatus(String requestId);

    List<String> getLatestRequestIdFor(String transactionId);
}