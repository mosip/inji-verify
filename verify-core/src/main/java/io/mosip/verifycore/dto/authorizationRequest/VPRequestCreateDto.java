package io.mosip.verifycore.dto.authorizationRequest;

import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
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