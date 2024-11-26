package io.mosip.verifyservice.services;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateResponseDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestDto;
import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.models.AuthorizationRequestCreateResponse;
import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;
import io.mosip.verifycore.utils.SecurityUtils;
import io.mosip.verifycore.utils.Utils;
import io.mosip.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.mosip.verifyservice.repository.PresentationDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;

import static io.mosip.verifycore.shared.Constants.DEFAULT_EXPIRY;

@Service
public class VerifiablePresentationRequestServiceImpl implements VerifiablePresentationRequestService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    public VerifiablePresentationRequestServiceImpl() {}

    @Override
    public AuthorizationRequestCreateResponseDto createAuthorizationRequest(AuthorizationRequestCreateDto vpRequestCreate, String serverURL) {

        //TODO : constants
        String transactionId = vpRequestCreate.getTransactionId()!=null ? vpRequestCreate.getTransactionId() : Utils.createID("txn");
        String requestId = Utils.createID("req");
        long  expiresAt  = Instant.now().plusSeconds(DEFAULT_EXPIRY).toEpochMilli();
        String nonce = vpRequestCreate.getNonce()!=null ? vpRequestCreate.getNonce() : SecurityUtils.generateNonce();

        PresentationDefinitionDto presentationDefinitionDto = vpRequestCreate.getPresentationDefinition();
        PresentationDefinition presentationDefinition = new PresentationDefinition(presentationDefinitionDto.getId(),presentationDefinitionDto.getInputDescriptors(), presentationDefinitionDto.getSubmissionRequirements());

        AuthorizationRequestDto authorizationRequestDto = new AuthorizationRequestDto(vpRequestCreate.getClientId(), presentationDefinition,nonce);
        AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new AuthorizationRequestCreateResponse(requestId, transactionId, authorizationRequestDto, expiresAt,Status.PENDING);

        presentationDefinitionRepository.save(presentationDefinition);
        authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);

        return new AuthorizationRequestCreateResponseDto(authorizationRequestCreateResponse);
    }

    @Override
    public Status getStatusFor(String requestId) {
       return authorizationRequestCreateResponseRepository.findById(requestId).map(authorizationRequestCreateResponse -> {
            Status currentStatus = authorizationRequestCreateResponse.getStatus();
            System.out.println(currentStatus);
            if (currentStatus == Status.PENDING && authorizationRequestCreateResponse.getExpiresAt() < Instant.now().toEpochMilli()){
                authorizationRequestCreateResponse.setStatus(Status.EXPIRED);
                authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
                return Status.EXPIRED;
            }
            return currentStatus;
        }).orElse(null);
    }

    @Override
    public String getTransactionIdFor(String requestId) {
        return authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getTransactionId).orElse(null);
    }

    @Override
    public String getStatusForRequestIdFor(String transactionId) {
        return authorizationRequestCreateResponseRepository.findFirstByTransactionIdOrderByExpiresAtDesc(transactionId).map(AuthorizationRequestCreateResponse::getRequestId).orElse(null);
    }
}
