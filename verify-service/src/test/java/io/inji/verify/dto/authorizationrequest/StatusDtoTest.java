package io.inji.verify.dto.authorizationrequest;

import io.inji.verify.enums.SubmissionState;
import org.junit.jupiter.api.Test;

public class StatusDtoTest {

    @Test
    public void testConstructor() {
        SubmissionState status = SubmissionState.COMPLETED;
        StatusDto statusDto = new StatusDto(status);
        assertEquals(status, statusDto.getStatus());
    }
}