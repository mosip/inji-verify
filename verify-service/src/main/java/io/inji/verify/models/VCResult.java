package io.inji.verify.models;


import io.inji.verify.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VCResult {
    String vc;
    VerificationStatus verificationStatus;
}
