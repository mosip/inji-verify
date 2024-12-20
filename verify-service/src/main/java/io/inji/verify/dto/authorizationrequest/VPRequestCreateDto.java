package io.inji.verify.dto.authorizationrequest;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VPRequestCreateDto {
    String clientId;
    String transactionId;
    String presentationDefinitionId;
    String nonce;
    VPDefinitionResponseDto presentationDefinition;
}