package io.mosip.verifyservice.services;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateResponseDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestCreateDto;
import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestDto;
import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
import io.mosip.verifycore.enums.Status;
import io.mosip.verifycore.models.AuthorizationRequestCreateResponse;
import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifyservice.repository.AuthorizationRequestCreateResponseRepository;
import io.mosip.verifyservice.repository.PresentationDefinitionRepository;
import io.mosip.verifycore.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.mosip.verifycore.spi.VerifiablePresentationRequestService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        String  expiresAt  = Instant.now().plusSeconds(5*60).toString();

        PresentationDefinitionDto presentationDefinitionDto = vpRequestCreate.getPresentationDefinition();
        PresentationDefinition presentationDefinition = new PresentationDefinition(presentationDefinitionDto.getId(),presentationDefinitionDto.getInputDescriptors(), presentationDefinitionDto.getSubmissionRequirements());

        AuthorizationRequestDto authorizationRequestDto = new AuthorizationRequestDto(vpRequestCreate.getClientId(), presentationDefinition,serverURL,requestId);
        AuthorizationRequestCreateResponse authorizationRequestCreateResponse = new AuthorizationRequestCreateResponse(requestId, transactionId, authorizationRequestDto, expiresAt,Status.PENDING);

        presentationDefinitionRepository.save(presentationDefinition);
        authorizationRequestCreateResponseRepository.save(authorizationRequestCreateResponse);

        return new AuthorizationRequestCreateResponseDto(authorizationRequestCreateResponse);
    }

    @Override
    public Status getStatusFor(String requestId) {

        return authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getStatus).orElse(null);
    }

    @Override
    public String getTransactionIdFor(String requestId) {
        return authorizationRequestCreateResponseRepository.findById(requestId).map(AuthorizationRequestCreateResponse::getTransactionId).orElse(null);
    }
}
