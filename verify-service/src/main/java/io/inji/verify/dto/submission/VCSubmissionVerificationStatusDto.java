package io.inji.verify.dto.submission;

import org.json.JSONObject;

import io.inji.verify.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VCSubmissionVerificationStatusDto {
    private JSONObject vc;
    private VerificationStatus verificationStatus;
}
