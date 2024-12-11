package io.inji.verify.spi;

import io.inji.verify.dto.submission.ResponseAcknowledgementDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;

public interface VerifiablePresentationSubmissionService {
    ResponseAcknowledgementDto submit(VPSubmissionDto vpSubmissionDto);

    VPTokenResultDto getVPResult(String requestId, String transactionId);
}
