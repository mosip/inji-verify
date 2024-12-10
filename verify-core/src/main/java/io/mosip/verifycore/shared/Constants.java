package io.mosip.verifycore.shared;

public class Constants {

    public static int DEFAULT_EXPIRY = 300 * 1000;
    public static final String RESPONSE_SUBMISSION_URI = "/vp-direct-post";
    public static final String VP_DEFINITION_URI = "/vp-definition/";
    public static final String RESPONSE_TYPE =  "vp_token";

    public static final String PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
    public static final String PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";
    public static final String TRANSACTION_ID_PREFIX = "txn";
    public static final String REQUEST_ID_PREFIX = "req";
    public static final String VC_EXPIRED_ERROR_CODE = "ERR_VC_EXPIRED";

    //JSON KEYS
    public static final String KEY_PROOF = "proof";
    public static final String KEY_JWS = "jws";
    public static final String KEY_VERIFICATION_METHOD = "verificationMethod";
    public static final String KEY_VERIFIABLE_CREDENTIAL = "verifiableCredential";
    public static final String KEY_CREDENTIAL = "credential";


}
