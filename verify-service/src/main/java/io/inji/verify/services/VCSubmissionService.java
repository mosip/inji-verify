package io.inji.verify.services;

import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;

public interface VCSubmissionService {
    VCSubmissionResponseDto submitVC(String vc);

    VCSubmissionVerificationStatusDto getVcWithVerification(String transactionId);
}
