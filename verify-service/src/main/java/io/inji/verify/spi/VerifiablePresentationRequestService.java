package io.inji.verify.spi;

import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.utils.ThreadSafeDelayedMethodCall;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;

public interface VerifiablePresentationRequestService {
    VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate);

    VPRequestStatusDto getCurrentRequestStatus(String requestId);

    List<String> getLatestRequestIdFor(String transactionId);

    void getCurrentRequestStatusPeriodic(String requestId, DeferredResult<VPRequestStatusDto> result, ThreadSafeDelayedMethodCall executor);
}
