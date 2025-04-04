package io.inji.verify.dto.result;

import io.inji.verify.enums.VerificationStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VCResultDtoTest {

    @Test
    public void shouldTestConstructor() {
        String vc = "myVC";

        VCResultDto vcResultDto = new VCResultDto(vc, VerificationStatus.SUCCESS);

        assertEquals(vc, vcResultDto.getVc());
        assertEquals(VerificationStatus.SUCCESS, vcResultDto.getVerificationStatus());
    }

}