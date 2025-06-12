package io.inji.verify.dto.result;


import io.mosip.vercred.vcverifier.data.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
@AllArgsConstructor
@Getter
public class VCResultDto {
    String vc;
    VerificationStatus verificationStatus;
}