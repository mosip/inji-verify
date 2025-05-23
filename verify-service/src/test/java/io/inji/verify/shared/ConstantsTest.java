package io.inji.verify.shared;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ConstantsTest {

    @Test
    void testConstantsValues() {
        assertEquals(300, Constants.DEFAULT_EXPIRY);
        assertEquals("/vp-submission", Constants.RESPONSE_SUBMISSION_URI_ROOT);
        assertEquals("/direct-post", Constants.RESPONSE_SUBMISSION_URI);
        assertEquals("/vp-definition/", Constants.VP_DEFINITION_URI);
        assertEquals("vp_token", Constants.RESPONSE_TYPE);
        assertEquals("txn", Constants.TRANSACTION_ID_PREFIX);
        assertEquals("req", Constants.REQUEST_ID_PREFIX);
        assertEquals("RsaSignature2018", Constants.RSA_SIGNATURE_2018);
        assertEquals("Ed25519Signature2018", Constants.ED25519_SIGNATURE_2018);
        assertEquals("Ed25519Signature2020", Constants.ED25519_SIGNATURE_2020);
        assertEquals("proof", Constants.KEY_PROOF);
        assertEquals("type", Constants.KEY_TYPE);
        assertEquals("jws", Constants.KEY_JWS);
        assertEquals("verificationMethod", Constants.KEY_VERIFICATION_METHOD);
        assertEquals("verifiableCredential", Constants.KEY_VERIFIABLE_CREDENTIAL);
        assertEquals("credential", Constants.KEY_CREDENTIAL);
    }
}