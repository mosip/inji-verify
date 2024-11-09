package io.mosip.verifycore.dto.authorizationRequest;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifycore.utils.SecurityUtils;
import lombok.*;

import java.io.Serializable;
import java.net.URI;
import java.time.Instant;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(force = true)
public class AuthorizationRequestDto implements Serializable {

    @JsonProperty("response_type")
    private final String responseType = "vp_token";

    @JsonProperty("client_id")
    private final String clientId;

    @JsonProperty("presentation_definition_uri")
    private final URI presentationDefinitionUri;

    @JsonProperty("response_uri")
    private URI responseUri;
    private String nonce;
    private final long iat;

    public AuthorizationRequestDto(String clientId, PresentationDefinition presentationDefinition, String serverURL, String requestId) {
        this.clientId = clientId;
        this.responseUri = URI.create(serverURL+"/vp-direct-post/"+requestId);
        this.presentationDefinitionUri = presentationDefinition.getURL(serverURL);
        this.iat = Instant.now().toEpochMilli();
        this.nonce  = SecurityUtils.generateNonce();
    }
}
