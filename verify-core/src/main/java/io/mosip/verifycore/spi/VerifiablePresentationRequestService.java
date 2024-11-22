package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateResponseDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateDto;
import io.mosip.verifycore.enums.Status;

import java.util.List;

public interface VerifiablePresentationRequestService {
    AuthorizationRequestCreateResponseDto createAuthorizationRequest(AuthorizationRequestCreateDto vpRequestCreate, String serverURL);
    Status getStatusFor(String requestId);
    String getTransactionIdFor(String requestId);
}
