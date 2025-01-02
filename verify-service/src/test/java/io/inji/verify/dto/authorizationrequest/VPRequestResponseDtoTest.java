package io.inji.verify.dto.authorizationrequest;

import io.inji.verify.models.PresentationDefinition;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class VPRequestResponseDtoTest {

    @Test
    public void testConstructor() {
        String transactionId = "tx123";
        String requestId = "req123";
        AuthorizationRequestResponseDto authorizationDetails = new AuthorizationRequestResponseDto("client123", "",new PresentationDefinition("pd123", mock(), mock()), "nonce123");
        long expiresAt = 1687318740000L;

        VPRequestResponseDto vpRequestResponseDto = new VPRequestResponseDto(transactionId, requestId, authorizationDetails, expiresAt);

        assertEquals(transactionId, vpRequestResponseDto.getTransactionId());
        assertEquals(requestId, vpRequestResponseDto.getRequestId());
        assertEquals(authorizationDetails, vpRequestResponseDto.getAuthorizationDetails());
        assertEquals(expiresAt, vpRequestResponseDto.getExpiresAt());
    }
}