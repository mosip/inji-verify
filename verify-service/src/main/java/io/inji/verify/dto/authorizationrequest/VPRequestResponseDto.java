package io.inji.verify.dto.authorizationrequest;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VPRequestResponseDto {
    String transactionId;
    String requestId;
    AuthorizationRequestResponseDto authorizationDetails;
    Long expiresAt;
}