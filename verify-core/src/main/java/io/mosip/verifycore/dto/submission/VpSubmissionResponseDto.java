package io.mosip.verifycore.dto.submission;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VpSubmissionResponseDto {
    String redirectUri;
    String error;
    String errorDescription;
}
