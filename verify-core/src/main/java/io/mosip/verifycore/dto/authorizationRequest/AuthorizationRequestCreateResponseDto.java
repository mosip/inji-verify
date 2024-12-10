package io.mosip.verifycore.dto.authorizationRequest;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AuthorizationRequestCreateResponseDto {
    String transactionId;
    String requestId;
    AuthorizationRequestDto authorizationDetails;
    long expiresAt;
}
