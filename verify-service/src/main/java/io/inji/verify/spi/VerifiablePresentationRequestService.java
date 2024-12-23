package io.inji.verify.spi;

import io.inji.verify.dto.authorizationrequest.StatusDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);

    StatusDto getCurrentRequestState(String requestId);
    String getTransactionIdFor(String requestId);
    String getLatestRequestIdFor(String transactionId);
}
