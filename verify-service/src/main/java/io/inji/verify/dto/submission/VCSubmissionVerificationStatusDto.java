package io.inji.verify.dto.submission;

import io.mosip.vercred.vcverifier.data.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class VCSubmissionVerificationStatusDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String vc;
    private VerificationStatus verificationStatus;
}
