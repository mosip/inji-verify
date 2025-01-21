package io.inji.verify.services;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.spi.VerifiablePresentationRequestService;
import io.inji.verify.utils.SecurityUtils;
import io.inji.verify.utils.ThreadSafeDelayedMethodCall;
import io.inji.verify.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class VerifiablePresentationRequestServiceImpl implements VerifiablePresentationRequestService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VPSubmissionRepository vpSubmissionRepository;

    @Override
    public VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate) throws PresentationDefinitionNotFoundException {
        log.info("Creating authorization request");
        String transactionId = Optional.ofNullable(vpRequestCreate.getTransactionId()).orElse(Utils.generateID(Constants.TRANSACTION_ID_PREFIX));
        String requestId = Utils.generateID(Constants.REQUEST_ID_PREFIX);
        long expiresAt = Instant.now().plusSeconds(Constants.DEFAULT_EXPIRY).toEpochMilli();
        String nonce = Optional.ofNullable(vpRequestCreate.getNonce()).orElseGet(SecurityUtils::generateNonce);

        AuthorizationRequestResponseDto authorizationRequestResponseDto = Optional.ofNullable(vpRequestCreate.getPresentationDefinitionId())
                .map(presentationDefinitionId -> {
                    return presentationDefinitionRepository.findById(presentationDefinitionId)
                            .map(presentationDefinition -> {
                                VPDefinitionResponseDto vpDefinitionResponseDto = new VPDefinitionResponseDto(presentationDefinition.getId(), presentationDefinition.getInputDescriptors(), presentationDefinition.getSubmissionRequirements());
                                return new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), presentationDefinition.getURL(), vpDefinitionResponseDto, nonce);
                            })
                            .orElse(null);
                })
                .orElse(new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), null, vpRequestCreate.getPresentationDefinition(), nonce));

        return Optional.of(authorizationRequestResponseDto).map(authRequestResponseDto ->{
            AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new AuthorizationRequestCreateResponse(requestId, transactionId, authRequestResponseDto, expiresAt);
            authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
            log.info("Authorization request created");
            return new VPRequestResponseDto(authorizationRequestCreateResponse.getTransactionId(), authorizationRequestCreateResponse.getRequestId(), authorizationRequestCreateResponse.getAuthorizationDetails(), authorizationRequestCreateResponse.getExpiresAt(), null, null);
        }).orElseThrow(PresentationDefinitionNotFoundException::new);
    }

    @Override
    public VPRequestStatusDto getCurrentRequestStatus(String requestId) {
        VPSubmission vpSubmission = vpSubmissionRepository.findById(requestId).orElse(null);

        if (vpSubmission != null) {
            return new VPRequestStatusDto(VPRequestStatus.VP_SUBMITTED);
        }
        Long expiresAt = authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getExpiresAt).orElse(null);
        if (expiresAt == null) {
            return null;
        }
        if (Instant.now().toEpochMilli() > expiresAt) {
            return new VPRequestStatusDto(VPRequestStatus.EXPIRED);
        }
        return new VPRequestStatusDto(VPRequestStatus.ACTIVE);
    }

    @Override
    public List<String> getLatestRequestIdFor(String transactionId) {
        return authorizationRequestCreateResponseRepository.findAllByTransactionIdOrderByExpiresAtDesc(transactionId).stream().map(AuthorizationRequestCreateResponse::getRequestId).toList();
    }

    @Override
    public AuthorizationRequestCreateResponse getLatestAuthorizationRequestFor(String transactionId) {
        String requestId = getLatestRequestIdFor(transactionId).getFirst();
        if (requestId == null) {
            return null;
        }
        return authorizationRequestCreateResponseRepository.findById(requestId).orElse(null);
    }

    @Override
    public void getCurrentRequestStatusPeriodic(String requestId, DeferredResult<VPRequestStatusDto> result, ThreadSafeDelayedMethodCall executor) {
        if (executor != null) executor.shutdown();
        VPRequestStatusDto currentRequestStatus = getCurrentRequestStatus(requestId);
        if (currentRequestStatus.getStatus() == null) {
            result.setErrorResult("NOT_FOUND");
        }
        if (currentRequestStatus.getStatus() != VPRequestStatus.ACTIVE) {
            result.setResult(currentRequestStatus);
        } else {
            ThreadSafeDelayedMethodCall threadSafeDelayedMethodCallExecutor = new ThreadSafeDelayedMethodCall();
            threadSafeDelayedMethodCallExecutor.scheduleMethod(() -> getCurrentRequestStatusPeriodic(requestId, result, threadSafeDelayedMethodCallExecutor), 5, TimeUnit.SECONDS);
        }
    }
}
