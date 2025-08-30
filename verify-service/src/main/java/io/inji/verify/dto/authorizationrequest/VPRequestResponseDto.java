package io.inji.verify.dto.authorizationrequest;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VPRequestResponseDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    String transactionId;
    String requestId;
    AuthorizationRequestResponseDto authorizationDetails;
    Long expiresAt;
    String requestUri;
}