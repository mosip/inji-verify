package io.inji.verify.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimbusds.jose.JOSEException;
import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;

public interface JwtService {
    String createAndSignAuthorizationRequestJwt(
            String verifierDid,
            AuthorizationRequestResponseDto authorizationRequest,
            String state
    ) throws JOSEException, JsonProcessingException;
}
