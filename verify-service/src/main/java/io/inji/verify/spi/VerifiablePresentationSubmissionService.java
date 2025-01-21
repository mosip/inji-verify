package io.inji.verify.spi;

import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.exception.VPSubmissionNotFoundException;

import java.util.List;

public interface VerifiablePresentationSubmissionService {
    void submit(VPSubmissionDto vpSubmissionDto);

    VPTokenResultDto getVPResult(List<String> requestId, String transactionId) throws VPSubmissionNotFoundException;
}
