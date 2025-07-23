package io.inji.verify.dto.submission;

import io.mosip.vercred.vcverifier.data.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Getter
public class VCSubmissionVerificationStatusDto implements Serializable {

    public VCSubmissionVerificationStatusDto() {
    }

    @Serial
    private static final long serialVersionUID = 1L;

    private String vc;
    private VerificationStatus verificationStatus;
}
