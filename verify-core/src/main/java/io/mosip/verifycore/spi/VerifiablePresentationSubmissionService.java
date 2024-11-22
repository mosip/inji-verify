package io.mosip.verifycore.spi;

import io.mosip.verifycore.dto.submission.VpSubmissionDto;
import io.mosip.verifycore.dto.submission.VpSubmissionResponseDto;
import io.mosip.verifycore.models.VpSubmission;

public interface VerifiablePresentationSubmissionService {
    VpSubmissionResponseDto submit(VpSubmissionDto vpSubmissionDto);

    VpSubmission getSubmissionResult(String requestId);
}
