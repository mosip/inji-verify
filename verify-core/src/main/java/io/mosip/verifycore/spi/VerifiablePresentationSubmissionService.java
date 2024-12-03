package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.VpSubmissionResponseDto;
import io.mosip.verifycore.dto.submission.VpTokenResultDto;

public interface VerifiablePresentationSubmissionService {
    VpSubmissionResponseDto submit(VpSubmissionDto vpSubmissionDto);

    VpTokenResultDto getSubmissionResult(String requestId, String transactionId);
}
