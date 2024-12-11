package io.inji.verify.verifyservice.dto.authorizationRequest;

import io.inji.verify.verifyservice.dto.presentation.PresentationDefinitionDto;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class VPRequestCreateDto {
    String clientId;
    String transactionId;
    String presentationDefinitionId;
    String nonce;
    PresentationDefinitionDto presentationDefinition;
}