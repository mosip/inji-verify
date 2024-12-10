package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.submission.VPSubmissionDto;
import io.mosip.verifycore.dto.submission.ResponseAcknowledgementDto;
import io.mosip.verifycore.dto.submission.VPTokenResultDto;

public interface VerifiablePresentationSubmissionService {
    ResponseAcknowledgementDto submit(VPSubmissionDto vpSubmissionDto);

    VPTokenResultDto getVPResult(String requestId, String transactionId);
}
