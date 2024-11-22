package io.mosip.verifycore.dto.authorizationRequest;

import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifycore.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.net.URI;
import java.time.Instant;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(force = true)
public class AuthorizationRequestDto implements Serializable {

    private final String responseType = "vp_token";
    private final String clientId;
    private final URI presentationDefinitionUri;
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
