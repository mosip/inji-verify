package io.inji.verify.dto.submission;

import io.inji.verify.enums.VerificationStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PresentationResponseDtoTest {

    @Test
    public void shouldTestConstructor() {
        String transactionId = "tx123";
        String vpToken = "some_vp_token";
        VerificationStatus verificationStatus = VerificationStatus.SUCCESS;

        PresentationResponseDto responseDto = new PresentationResponseDto(transactionId, vpToken, verificationStatus);

        assertEquals(transactionId, responseDto.getTransactionId());
        assertEquals(vpToken, responseDto.getVpToken());
        assertEquals(verificationStatus, responseDto.getVerificationStatus());
    }
}