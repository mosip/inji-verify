package io.inji.verify.dto.submission;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VPSubmissionResponseDto {
    String redirectUri;
    String error;
    String errorDescription;
}
