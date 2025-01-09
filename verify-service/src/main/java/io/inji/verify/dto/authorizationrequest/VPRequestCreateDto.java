package io.inji.verify.dto.authorizationrequest;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
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
    VPDefinitionResponseDto presentationDefinition;
}
