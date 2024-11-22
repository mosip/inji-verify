package io.mosip.verifycore.dto.authorizationRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONObject;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizationRequestResultDto {
    String transactionId;
    boolean verified;
    JSONObject claims;
}
