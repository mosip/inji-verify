package io.inji.verify.spi;

import io.inji.verify.dto.authorizationRequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationRequest.VPRequestResponseDto;
import io.inji.verify.enums.SubmissionState;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);
    SubmissionState getCurrentAuthorizationRequestStateFor(String requestId);
    String getTransactionIdFor(String requestId);
    String getLatestRequestIdFor(String transactionId);
}
