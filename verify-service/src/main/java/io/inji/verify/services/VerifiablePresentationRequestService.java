package io.inji.verify.services;

import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.utils.ThreadSafeDelayedMethodCall;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate) throws PresentationDefinitionNotFoundException;

    VPRequestStatusDto getCurrentRequestStatus(String requestId);

    List<String> getLatestRequestIdFor(String transactionId);

    AuthorizationRequestCreateResponse getLatestAuthorizationRequestFor(String transactionId);

    void getCurrentRequestStatusPeriodic(String requestId, DeferredResult<VPRequestStatusDto> result, ThreadSafeDelayedMethodCall executor);
}
