package io.mosip.verifycore.dto.authorizationRequest;

import io.mosip.verifycore.models.PresentationDefinition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor(force = true)
public class AuthorizationRequestDto implements Serializable {

    private final String responseType = "vp_token";
    private final String clientId;
    private final String presentationDefinitionUri;
    private String responseUri;
    private String nonce;
    private final long iat;

    public AuthorizationRequestDto(String clientId, PresentationDefinition presentationDefinition,String nonce) {
        this.clientId = clientId;
        this.responseUri = "/vp-direct-post";
        this.presentationDefinitionUri = presentationDefinition.getURL();
        this.iat = Instant.now().toEpochMilli();
        this.nonce  = nonce;
    }
}
