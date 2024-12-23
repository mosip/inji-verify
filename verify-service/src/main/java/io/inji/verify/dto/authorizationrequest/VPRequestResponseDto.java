package io.inji.verify.dto.authorizationrequest;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class VPRequestResponseDto {
    String transactionId;
    String requestId;
    AuthorizationRequestResponseDto authorizationDetails;
    long expiresAt;
}
