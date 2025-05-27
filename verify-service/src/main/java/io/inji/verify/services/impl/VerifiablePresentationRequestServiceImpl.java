package io.inji.verify.services.impl;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.utils.SecurityUtils;
import io.inji.verify.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;

@Service
@Slf4j
public class VerifiablePresentationRequestServiceImpl implements VerifiablePresentationRequestService {

    final PresentationDefinitionRepository presentationDefinitionRepository;
    final AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    final VPSubmissionRepository vpSubmissionRepository;
    @Value("${inji.vp-request.long-polling-timeout}")
    Long defaultTimeout;

    HashMap<String, DeferredResult<VPRequestStatusDto>> vpRequestStatusListeners = new HashMap<>();

    public VerifiablePresentationRequestServiceImpl(PresentationDefinitionRepository presentationDefinitionRepository, AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository, VPSubmissionRepository vpSubmissionRepository) {
        this.presentationDefinitionRepository = presentationDefinitionRepository;
        this.authorizationRequestCreateResponseRepository = authorizationRequestCreateResponseRepository;
        this.vpSubmissionRepository = vpSubmissionRepository;
    }

    @Override
    public VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate) throws PresentationDefinitionNotFoundException {
        log.info("Creating authorization request");
        String transactionId = vpRequestCreate.getTransactionId() != null ? vpRequestCreate.getTransactionId() : Utils.generateID(Constants.TRANSACTION_ID_PREFIX);
        String requestId = Utils.generateID(Constants.REQUEST_ID_PREFIX);
        long expiresAt = Instant.now().plusSeconds(Constants.DEFAULT_EXPIRY).toEpochMilli();
        String nonce = vpRequestCreate.getNonce() != null ? vpRequestCreate.getNonce() : SecurityUtils.generateNonce();

        AuthorizationRequestResponseDto authorizationRequestResponseDto = Optional.ofNullable(vpRequestCreate.getPresentationDefinitionId())
                .map(presentationDefinitionId -> presentationDefinitionRepository.findById(presentationDefinitionId)
                .map(presentationDefinition -> {
                    VPDefinitionResponseDto vpDefinitionResponseDto = new VPDefinitionResponseDto(presentationDefinition.getId(), presentationDefinition.getInputDescriptors(), presentationDefinition.getName(),presentationDefinition.getPurpose(),presentationDefinition.getFormat(), presentationDefinition.getSubmissionRequirements());
                    return new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), presentationDefinition.getURL(), vpDefinitionResponseDto, nonce);
                })
                .orElseThrow(PresentationDefinitionNotFoundException::new))
                .orElseGet(() -> new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), null, vpRequestCreate.getPresentationDefinition(), nonce));

        AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new AuthorizationRequestCreateResponse(requestId, transactionId, authorizationRequestResponseDto, expiresAt);
        authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
        log.info("Authorization request created");
        return new VPRequestResponseDto(authorizationRequestCreateResponse.getTransactionId(), authorizationRequestCreateResponse.getRequestId(), authorizationRequestCreateResponse.getAuthorizationDetails(), authorizationRequestCreateResponse.getExpiresAt());

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

    private void registerVpRequestStatusListener(String requestId, DeferredResult<VPRequestStatusDto> result) {
        vpRequestStatusListeners.put(requestId, result);
    }

    @Override
    public void invokeVpRequestStatusListener(String requestId) {
        Optional.ofNullable(vpRequestStatusListeners.get(requestId)).map(vpRequestStatusDtoDeferredResult -> {
            vpRequestStatusDtoDeferredResult.setResult(new VPRequestStatusDto(VPRequestStatus.VP_SUBMITTED));
            vpRequestStatusListeners.remove(requestId);
            return null;
        });
    }

    @Override
    public DeferredResult<VPRequestStatusDto> getStatus(String requestId) {
       return authorizationRequestCreateResponseRepository
                .findById(requestId)
                .map(authorizationRequestCreateResponse -> {
                    long expiresAt = authorizationRequestCreateResponse.getExpiresAt();
                    Long timeToExpiry = expiresAt - Instant.now().toEpochMilli();
                    Long timeOut = timeToExpiry > defaultTimeout ? defaultTimeout : timeToExpiry;
                    DeferredResult<VPRequestStatusDto> result = new DeferredResult<>(timeOut);
                    VPRequestStatusDto currentRequestStatus = getCurrentRequestStatus(requestId);

                    if (currentRequestStatus.getStatus() == VPRequestStatus.EXPIRED) {
                        result.setResult(new VPRequestStatusDto(VPRequestStatus.EXPIRED));
                        return result;
                    }

                    result.onTimeout(() -> result.setResult(getCurrentRequestStatus(requestId)));
                    registerVpRequestStatusListener(requestId, result);
                    return result;
                })
                .orElseGet(() -> {
                    DeferredResult<VPRequestStatusDto> result = new DeferredResult<>();
                    result.setErrorResult(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorDto(ErrorCode.NO_AUTH_REQUEST)));
                    return result;
                });
    }
}
