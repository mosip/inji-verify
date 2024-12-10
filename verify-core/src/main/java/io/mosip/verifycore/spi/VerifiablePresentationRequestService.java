package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.authorizationRequest.VPRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.VPRequestResponseDto;
import io.mosip.verifycore.enums.SubmissionState;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);
    SubmissionState getCurrentSubmissionStateFor(String requestId);
    String getTransactionIdFor(String requestId);
    String getLatestRequestIdFor(String transactionId);
}
