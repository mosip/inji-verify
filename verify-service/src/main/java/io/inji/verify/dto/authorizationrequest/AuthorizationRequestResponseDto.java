package io.inji.verify.dto.authorizationrequest;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.shared.Constants;
import lombok.Getter;

import java.io.Serializable;
import java.time.Instant;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthorizationRequestResponseDto implements Serializable {

    private final String responseType = Constants.RESPONSE_TYPE;
    private final String clientId;
    private final String presentationDefinitionUri;
    private final String responseUri;
    private final String nonce;
    private final long issuedAt;

    public AuthorizationRequestResponseDto(String clientId, PresentationDefinition presentationDefinition, String nonce) {
        this.clientId = clientId;
        this.responseUri = Constants.RESPONSE_SUBMISSION_URI_ROOT + Constants.RESPONSE_SUBMISSION_URI;
        this.presentationDefinitionUri = presentationDefinition.getURL();
        this.issuedAt = Instant.now().toEpochMilli();
        this.nonce  = nonce;
    }
}