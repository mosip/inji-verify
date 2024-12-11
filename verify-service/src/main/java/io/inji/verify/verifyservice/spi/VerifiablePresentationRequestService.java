package io.inji.verify.verifyservice.spi;

import io.inji.verify.verifyservice.dto.authorizationRequest.VPRequestCreateDto;
import io.inji.verify.verifyservice.dto.authorizationRequest.VPRequestResponseDto;
import io.inji.verify.verifyservice.enums.SubmissionState;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);
    SubmissionState getCurrentAuthorizationRequestStateFor(String requestId);
    String getTransactionIdFor(String requestId);
    String getLatestRequestIdFor(String transactionId);
}
