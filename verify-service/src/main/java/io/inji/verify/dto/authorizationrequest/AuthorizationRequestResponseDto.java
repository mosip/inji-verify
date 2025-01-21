package io.inji.verify.dto.authorizationrequest;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.shared.Constants;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthorizationRequestResponseDto {

    private final String responseType = Constants.RESPONSE_TYPE;
    private final String responseUri = Constants.RESPONSE_SUBMISSION_URI_ROOT + Constants.RESPONSE_SUBMISSION_URI;
    private final long issuedAt = Instant.now().toEpochMilli();
    private final String clientId;
    private final String presentationDefinitionUri;
    private final VPDefinitionResponseDto presentationDefinition;
    private final String nonce;
}
