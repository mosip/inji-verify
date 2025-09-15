package io.inji.verify.utils;

import io.mosip.vercred.vcverifier.utils.Base64Decoder;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;

import java.util.Set;
import java.util.UUID;

@Slf4j
public final class Utils {

    private static final Set<String> VALID_JWT_TYPES = Set.of("vc+sd-jwt", "dc+sd-jwt");

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
        return VALID_JWT_TYPES.contains(typ);
    }

    private static String decodeBase64Json(String encoded)  {
        byte[] decodedBytes = new Base64Decoder().decodeFromBase64Url(encoded);
        return new String(decodedBytes);
    }
}
