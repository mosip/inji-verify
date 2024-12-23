package io.inji.verify.spi;

import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);

    VPRequestStatusDto getCurrentRequestStatus(String requestId);
    String getTransactionIdFor(String requestId);
    String getLatestRequestIdFor(String transactionId);
}
