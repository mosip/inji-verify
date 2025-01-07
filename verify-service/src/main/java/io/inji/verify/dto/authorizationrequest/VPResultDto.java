package io.inji.verify.dto.authorizationrequest;

import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VPResultDto {
    String transactionId;
    boolean verified;
    JSONObject claims;
}