package io.inji.verify.services;

import org.json.JSONObject;

import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import jakarta.validation.Valid;

public interface VCSubmissionService {
    VCSubmissionResponseDto submitVC(@Valid JSONObject vc);

    VCSubmissionVerificationStatusDto getVcWithVerification(String transactionId);
}
