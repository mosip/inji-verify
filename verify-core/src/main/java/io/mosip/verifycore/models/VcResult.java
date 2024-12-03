package io.mosip.verifycore.models;


import io.mosip.verifycore.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONObject;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VcResult {
    String vc;
    VerificationStatus verificationStatus;
}
