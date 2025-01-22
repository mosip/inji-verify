package io.inji.verify.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.Ed25519Verifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jwt.SignedJWT;
import io.inji.verify.shared.Constants;
import org.json.JSONObject;

import java.text.ParseException;

public class VerificationUtils {
    public static void verifyRsaSignature2018(JSONObject proofObject) throws Exception {
        String publicKeyPem = proofObject.getString(Constants.KEY_VERIFICATION_METHOD);
        Algorithm algorithm = Algorithm.RSA256(SecurityUtils.readX509PublicKey(publicKeyPem), null);
        String jws = proofObject.getString(Constants.KEY_JWS);
        JWTVerifier verifier = JWT.require(algorithm).build();
        verifier.verify(jws);
    }

    public static void verifyEd25519Signature(JSONObject proofObject) throws ParseException, JOSEException {
        SignedJWT parsedJWS = SignedJWT.parse(proofObject.getString(Constants.KEY_JWS));
        JWK jwk = parsedJWS.getHeader().getJWK();
        OctetKeyPair okp = (OctetKeyPair) jwk;
        JWSVerifier verifier = new Ed25519Verifier(okp);
        parsedJWS.verify(verifier);
    }
}
