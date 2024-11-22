package io.mosip.verifycore.dto.authorizationRequest;

import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AuthorizationRequestCreateDto {
    String clientId;
    String verificationType;
    String transactionId;
    PresentationDefinitionDto presentationDefinition;
}