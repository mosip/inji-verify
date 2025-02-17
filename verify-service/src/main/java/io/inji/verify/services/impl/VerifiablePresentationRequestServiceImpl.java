package io.inji.verify.services.impl;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
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
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class VerifiablePresentationRequestServiceImpl implements VerifiablePresentationRequestService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VPSubmissionRepository vpSubmissionRepository;

    HashMap<String,DeferredResult<VPRequestStatusDto>> submissionListeners = new HashMap<>();

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
                            VPDefinitionResponseDto vpDefinitionResponseDto = new VPDefinitionResponseDto(presentationDefinition.getId(), presentationDefinition.getInputDescriptors(), presentationDefinition.getSubmissionRequirements());
                            return new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), presentationDefinition.getURL(), vpDefinitionResponseDto, nonce);
                        })
                        .orElseThrow(PresentationDefinitionNotFoundException::new))
                .orElseGet(() -> new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), null, vpRequestCreate.getPresentationDefinition(), nonce));


        AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new
                AuthorizationRequestCreateResponse(requestId, transactionId, authorizationRequestResponseDto, expiresAt);
        authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
        log.info("Authorization request created");
        return new VPRequestResponseDto(authorizationRequestCreateResponse.getTransactionId(), authorizationRequestCreateResponse.getRequestId(), authorizationRequestCreateResponse.getAuthorizationDetails(), authorizationRequestCreateResponse.getExpiresAt());

    }

    @Override
    public VPRequestStatusDto getCurrentRequestStatus(String requestId) {
        log.info("Get Current Rqst Status...");
        VPSubmission vpSubmission = vpSubmissionRepository.findById(requestId).orElse(null);

        if (vpSubmission != null) {
            log.info("Get Current Rqst Status... VP_SUBMITTED");
            return new VPRequestStatusDto(VPRequestStatus.VP_SUBMITTED);
        }
        Long expiresAt = authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getExpiresAt).orElse(null);
        if (expiresAt == null) {
            log.info("Get Current Rqst Status... NULL");
            return null;
        }
        if (Instant.now().toEpochMilli() > expiresAt) {
        log.info("Get Current Rqst Status... EXPIRED");
            return new VPRequestStatusDto(VPRequestStatus.EXPIRED);
        }
        log.info("Get Current Rqst Status... ACTIVE");
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
    public void registerSubmissionListener(String requestId, DeferredResult<VPRequestStatusDto> result) {
        VPRequestStatusDto currentRequestStatus = getCurrentRequestStatus(requestId);
        if (currentRequestStatus.getStatus() == null) {
            log.info("Result error : NOT_FOUND");
            result.setErrorResult("NOT_FOUND");
            return;
        }
        if (currentRequestStatus.getStatus() == VPRequestStatus.EXPIRED) {
            log.info("Result error : EXPIRED");
            result.setResult(new VPRequestStatusDto(VPRequestStatus.EXPIRED));
            return;
        }
        submissionListeners.put(requestId, result);
    }

    @Override
    public void invokeSubmissionListener(String requestId) {
        DeferredResult<VPRequestStatusDto> vpRequestStatusDtoDeferredResult = submissionListeners.get(requestId);
        vpRequestStatusDtoDeferredResult.setResult(new VPRequestStatusDto(VPRequestStatus.VP_SUBMITTED));
        log.info("Result success : VP_SUBMITTED");
        submissionListeners.remove(requestId);
    }
}
