package io.inji.verify.services;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.shared.Constants;
import io.inji.verify.spi.VerifiablePresentationRequestService;
import io.inji.verify.utils.SecurityUtils;
import io.inji.verify.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class VerifiablePresentationRequestServiceImpl implements VerifiablePresentationRequestService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    @Autowired
    VPSubmissionRepository vpSubmissionRepository;
    public VerifiablePresentationRequestServiceImpl() {}

    @Override
    public VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate) {

        String transactionId = vpRequestCreate.getTransactionId()!=null ? vpRequestCreate.getTransactionId() : Utils.generateID(Constants.TRANSACTION_ID_PREFIX);
        String requestId = Utils.generateID(Constants.REQUEST_ID_PREFIX);
        long  expiresAt  = Instant.now().plusSeconds(Constants.DEFAULT_EXPIRY).toEpochMilli();
        String nonce = vpRequestCreate.getNonce()!=null ? vpRequestCreate.getNonce() : SecurityUtils.generateNonce();

        PresentationDefinitionDto presentationDefinitionDto = vpRequestCreate.getPresentationDefinition();
        PresentationDefinition presentationDefinition = new PresentationDefinition(presentationDefinitionDto.getId(),presentationDefinitionDto.getInputDescriptors(), presentationDefinitionDto.getSubmissionRequirements());

        AuthorizationRequestResponseDto authorizationRequestResponseDto = new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), presentationDefinition,nonce);
        AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new AuthorizationRequestCreateResponse(requestId, transactionId, authorizationRequestResponseDto, expiresAt);

        presentationDefinitionRepository.save(presentationDefinition);
        authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);

        return new VPRequestResponseDto(authorizationRequestCreateResponse.getTransactionId(),authorizationRequestCreateResponse.getRequestId(),authorizationRequestCreateResponse.getAuthorizationDetails(),authorizationRequestCreateResponse.getExpiresAt());
    }

    @Override
    public VPRequestStatusDto getCurrentRequestStatus(String requestId) {
        VPSubmission vpSubmission = vpSubmissionRepository.findById(requestId).orElse(null);

        if (vpSubmission != null) {
            return new VPRequestStatusDto(VPRequestStatus.COMPLETED);
        }
        Long expiresAt = authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getExpiresAt).orElse(null);
        if (expiresAt == null){
            return null;
        }
        if(Instant.now().toEpochMilli() > expiresAt){
            return new VPRequestStatusDto(VPRequestStatus.EXPIRED);
        }
        return new VPRequestStatusDto(VPRequestStatus.ACTIVE);
    }

    @Override
    public String getTransactionIdFor(String requestId) {
        return authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getTransactionId).orElse(null);
    }

    @Override
    public String getLatestRequestIdFor(String transactionId) {
        return authorizationRequestCreateResponseRepository.findFirstByTransactionIdOrderByExpiresAtDesc(transactionId).map(AuthorizationRequestCreateResponse::getRequestId).orElse(null);
    }
}
