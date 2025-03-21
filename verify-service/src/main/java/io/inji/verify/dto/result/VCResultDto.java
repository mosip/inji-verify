package io.inji.verify.dto.result;


import io.inji.verify.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class VCResultDto {
    String vc;
    VerificationStatus verificationStatus;
}