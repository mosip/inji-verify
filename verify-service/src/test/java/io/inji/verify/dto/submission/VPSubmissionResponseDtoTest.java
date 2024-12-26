package io.inji.verify.dto.submission;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VPSubmissionResponseDtoTest {
    @Test
    public void shouldTestConstructor() {
        String redirect = "redirect";
        String error = "error";
        String errorDescription = "error description";
        VPSubmissionResponseDto VPSubmissionResponseDto = new VPSubmissionResponseDto(redirect, error,errorDescription);

        assertEquals(redirect, VPSubmissionResponseDto.getRedirectUri());
        assertEquals(errorDescription, VPSubmissionResponseDto.getErrorDescription());
        assertEquals(error, VPSubmissionResponseDto.getError());
    }

}