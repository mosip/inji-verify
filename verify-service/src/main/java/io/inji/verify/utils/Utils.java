package io.inji.verify.utils;

import io.inji.verify.shared.Constants;
import io.mosip.vercred.vcverifier.data.CredentialStatusResult;
import io.mosip.vercred.vcverifier.data.CredentialVerificationSummary;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import io.mosip.vercred.vcverifier.utils.Base64Decoder;
import io.mosip.vercred.vcverifier.utils.Util;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
public final class Utils {

    private static final Set<String> VALID_SD_JWT_TYPES = Set.of("vc+sd-jwt", "dc+sd-jwt");

    private Utils() {
    }

    public static String generateID(String prefix) {
        return prefix + "_" + UUID.randomUUID();
    }

    public static boolean isSdJwt(String vpToken) {
        String[] jwtParts = vpToken.split("~")[0].split("\\.");
        if (jwtParts.length != 3) {
            return false;
        }
        String header = decodeBase64Json(jwtParts[0]);
        String typ = new JSONObject(header).optString("typ", "");
        return VALID_SD_JWT_TYPES.contains(typ);
    }

    private static String decodeBase64Json(String encoded)  {
        byte[] decodedBytes = new Base64Decoder().decodeFromBase64Url(encoded);
        return new String(decodedBytes);
    }

    public static VerificationStatus getVcVerificationStatus(CredentialVerificationSummary credentialVerificationSummary) {
        log.info("Credential Verification Summary: {}", credentialVerificationSummary);
        VerificationResult verificationResult = credentialVerificationSummary.getVerificationResult();
        VerificationStatus verificationStatus = Util.INSTANCE.getVerificationStatus(verificationResult);
        log.info("VC Verification Status:: {}", verificationStatus);

        List<CredentialStatusResult> credentialStatusResults = credentialVerificationSummary.getCredentialStatus();
        log.info("Credential Status: {}", credentialStatusResults);

        if (!credentialStatusResults.isEmpty()) {
            for (CredentialStatusResult credentialStatusResult : credentialStatusResults) {
                String purpose = credentialStatusResult.getPurpose();
                int status = credentialStatusResult.getStatus();
                boolean isRevoked = purpose.equalsIgnoreCase(Constants.STATUS_PURPOSE_REVOKED);
                if (isRevoked && status == 1) return VerificationStatus.REVOKED;
            }
        }

        return verificationStatus;
    }
}
