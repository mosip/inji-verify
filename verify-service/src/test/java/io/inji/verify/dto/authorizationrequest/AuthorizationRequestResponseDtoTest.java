package io.inji.verify.dto.authorizationrequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.Test;

import java.time.Instant;

public class AuthorizationRequestResponseDtoTest {

    @Test
    public void ShouldTestConstructorSetsFieldsCorrectly() {
        String clientId = "testClientId";
        PresentationDefinition presentationDefinition = mock(PresentationDefinition.class);
        String nonce = "testNonce";

        AuthorizationRequestResponseDto responseDto = new AuthorizationRequestResponseDto(clientId, null, presentationDefinition,nonce);

        assertEquals(Constants.RESPONSE_TYPE, responseDto.getResponseType());
        assertEquals(clientId, responseDto.getClientId());
        assertEquals(presentationDefinition.getURL(), responseDto.getPresentationDefinitionUri());
        assertEquals(Constants.RESPONSE_SUBMISSION_URI, responseDto.getResponseUri());
        assertEquals(nonce, responseDto.getNonce());
        assertTrue(Instant.now().toEpochMilli() >= responseDto.getIssuedAt()); // Ensure issuedAt is in the past
    }
}