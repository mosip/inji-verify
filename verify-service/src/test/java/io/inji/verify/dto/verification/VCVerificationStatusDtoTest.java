package io.inji.verify.dto.verification;

import io.inji.verify.enums.VerificationStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VCVerificationStatusDtoTest {
    @Test
    public void shouldTestConstructor() {
        VCVerificationStatusDto successDto = new  VCVerificationStatusDto(VerificationStatus.SUCCESS);
        assertEquals(VerificationStatus.SUCCESS, successDto.getVerificationStatus());

        VCVerificationStatusDto expiredDto = new  VCVerificationStatusDto(VerificationStatus.EXPIRED);
        assertEquals(VerificationStatus.EXPIRED, expiredDto.getVerificationStatus());

        VCVerificationStatusDto invalidDto = new  VCVerificationStatusDto(VerificationStatus.INVALID);
        assertEquals(VerificationStatus.INVALID, invalidDto.getVerificationStatus());
    }

}