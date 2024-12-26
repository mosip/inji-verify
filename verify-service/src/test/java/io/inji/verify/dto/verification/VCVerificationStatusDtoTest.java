package io.inji.verify.dto.verification;

import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.enums.VerificationStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VCVerificationStatusDtoTest {
    @Test
    public void shouldTestConstructor() {
        VCVerificationStatusDto successDto = new  VCVerificationStatusDto(VerificationStatus.SUCCESS);
        assertEquals(successDto.getVerificationStatus(),VerificationStatus.SUCCESS);

        VCVerificationStatusDto expiredDto = new  VCVerificationStatusDto(VerificationStatus.EXPIRED);
        assertEquals(expiredDto.getVerificationStatus(),VerificationStatus.EXPIRED);

        VCVerificationStatusDto invalidDto = new  VCVerificationStatusDto(VerificationStatus.INVALID);
        assertEquals(invalidDto.getVerificationStatus(),VerificationStatus.INVALID);
    }

}