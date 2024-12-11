package io.inji.verify.verifyservice.services;

import io.inji.verify.verifyservice.dto.authorizationRequest.VPRequestCreateDto;
import io.inji.verify.verifyservice.dto.authorizationRequest.VPRequestResponseDto;
import io.inji.verify.verifyservice.dto.authorizationRequest.AuthorizationRequestResponseDto;
import io.inji.verify.verifyservice.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.verifyservice.enums.SubmissionState;
import io.inji.verify.verifyservice.models.AuthorizationRequestCreateResponse;
import io.inji.verify.verifyservice.models.PresentationDefinition;
import io.inji.verify.verifyservice.shared.Constants;
import io.inji.verify.verifyservice.spi.VerifiablePresentationRequestService;
import io.inji.verify.verifyservice.utils.SecurityUtils;
import io.inji.verify.verifyservice.utils.Utils;
import io.inji.verify.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.verifyservice.repository.PresentationDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Timer;
import java.util.TimerTask;

import static io.inji.verify.verifyservice.shared.Constants.DEFAULT_EXPIRY;

@Service
public class VerifiablePresentationRequestServiceImpl implements VerifiablePresentationRequestService {

    @Autowired
    PresentationDefinitionRepository presentationDefinitionRepository;
    @Autowired
    AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;
    public VerifiablePresentationRequestServiceImpl() {}

    @Override
    public VPRequestResponseDto createAuthorizationRequest(VPRequestCreateDto vpRequestCreate) {

        String transactionId = vpRequestCreate.getTransactionId()!=null ? vpRequestCreate.getTransactionId() : Utils.generateID(Constants.TRANSACTION_ID_PREFIX);
        String requestId = Utils.generateID(Constants.REQUEST_ID_PREFIX);
        long  expiresAt  = Instant.now().plusSeconds(DEFAULT_EXPIRY).toEpochMilli();
        String nonce = vpRequestCreate.getNonce()!=null ? vpRequestCreate.getNonce() : SecurityUtils.generateNonce();

        PresentationDefinitionDto presentationDefinitionDto = vpRequestCreate.getPresentationDefinition();
        PresentationDefinition presentationDefinition = new PresentationDefinition(presentationDefinitionDto.getId(),presentationDefinitionDto.getInputDescriptors(), presentationDefinitionDto.getSubmissionRequirements());

        AuthorizationRequestResponseDto authorizationRequestResponseDto = new AuthorizationRequestResponseDto(vpRequestCreate.getClientId(), presentationDefinition,nonce);
        AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new AuthorizationRequestCreateResponse(requestId, transactionId, authorizationRequestResponseDto, expiresAt, SubmissionState.PENDING);

        presentationDefinitionRepository.save(presentationDefinition);
        authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
        startStatusAutoTimer(requestId);

        return new VPRequestResponseDto(authorizationRequestCreateResponse.getTransactionId(),authorizationRequestCreateResponse.getRequestId(),authorizationRequestCreateResponse.getAuthorizationDetails(),authorizationRequestCreateResponse.getExpiresAt());
    }

    @Override
    public SubmissionState getCurrentAuthorizationRequestStateFor(String requestId) {
       return authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getSubmissionState).orElse(null);
    }

    @Override
    public String getTransactionIdFor(String requestId) {
        return authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getTransactionId).orElse(null);
    }

    @Override
    public String getLatestRequestIdFor(String transactionId) {
        return authorizationRequestCreateResponseRepository.findFirstByTransactionIdOrderByExpiresAtDesc(transactionId).map(AuthorizationRequestCreateResponse::getRequestId).orElse(null);
    }

    private void updateStatusToExpired(String requestId){
        authorizationRequestCreateResponseRepository.findById(requestId).map(authorizationRequestCreateResponse -> {
            if (authorizationRequestCreateResponse.getSubmissionState() == SubmissionState.PENDING){
                authorizationRequestCreateResponse.setSubmissionState(SubmissionState.EXPIRED);
                authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);
            }
            return null;
        });
    }

    private void startStatusAutoTimer(String requestId) {
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                updateStatusToExpired(requestId);
            }
        }, DEFAULT_EXPIRY);
    }
}
