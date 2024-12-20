package io.inji.verify.dto.authorizationrequest;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VPRequestResponseDto {
    String transactionId;
    String requestId;
    AuthorizationRequestResponseDto authorizationDetails;
    long expiresAt;
}
