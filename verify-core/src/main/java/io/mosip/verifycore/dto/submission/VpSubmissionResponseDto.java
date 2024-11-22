package io.mosip.verifycore.dto.submission;


import io.mosip.verifycore.enums.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VpSubmissionResponseDto {
    SubmissionStatus status;
    String redirectUri;
    String error;
    String errorDescription;
}
