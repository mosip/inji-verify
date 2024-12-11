package io.inji.verify.verifyservice.spi;

import io.inji.verify.verifyservice.dto.submission.ResponseAcknowledgementDto;
import io.inji.verify.verifyservice.dto.submission.VPSubmissionDto;
import io.inji.verify.verifyservice.dto.submission.VPTokenResultDto;

public interface VerifiablePresentationSubmissionService {
    ResponseAcknowledgementDto submit(VPSubmissionDto vpSubmissionDto);

    VPTokenResultDto getVPResult(String requestId, String transactionId);
}
