package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.ResponseAcknowledgementDto;
import io.mosip.verifycore.dto.submission.VpTokenResultDto;

public interface VerifiablePresentationSubmissionService {
    ResponseAcknowledgementDto submit(VpSubmissionDto vpSubmissionDto);

    VpTokenResultDto getSubmissionResult(String requestId, String transactionId);
}
