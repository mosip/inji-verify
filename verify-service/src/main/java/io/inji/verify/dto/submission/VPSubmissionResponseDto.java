package io.inji.verify.dto.submission;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VPSubmissionResponseDto {
    String redirectUri;
    String error;
    String errorDescription;
}