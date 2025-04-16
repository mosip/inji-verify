package io.inji.verify.dto.submission;

import io.inji.verify.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VCSubmissionVerificationStatusDto {
    private String vc;
    private VerificationStatus verificationStatus;
}
