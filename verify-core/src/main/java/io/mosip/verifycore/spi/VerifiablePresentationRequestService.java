package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateResponseDto;
import io.mosip.verifycore.enums.SubmissionState;

public interface VerifiablePresentationRequestService {
    AuthorizationRequestCreateResponseDto createAuthorizationRequest(AuthorizationRequestCreateDto vpRequestCreate);
    SubmissionState getCurrentSubmissionStateFor(String requestId);
    String getTransactionIdFor(String requestId);
    String getStatusForRequestIdFor(String transactionId);
}
