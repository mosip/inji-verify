package io.inji.verify.services.impl;

import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jose.util.Base64URL;
import io.inji.verify.services.KeyManagementService;
import io.inji.verify.key.impl.P12KeyExtractor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.security.KeyPair;
import java.security.interfaces.EdECPrivateKey;
import java.security.interfaces.EdECPublicKey;

@Service
public class P12FileKeyManagementServiceImpl implements KeyManagementService<OctetKeyPair> {

    P12KeyExtractor extractor;

    private KeyPair ed25519KeyPair;

    public P12FileKeyManagementServiceImpl(P12KeyExtractor extractor) {
        this.extractor = extractor;
    }

    @PostConstruct
    public void loadKey() {
        this.ed25519KeyPair = extractor.extractKeyPair();
    }

    @Override
    public OctetKeyPair getKeyPair() {
        if (ed25519KeyPair == null) {
            throw new IllegalStateException("Ed25519 Key not loaded.");
        }

        EdECPrivateKey edECPrivateKey = (EdECPrivateKey) ed25519KeyPair.getPrivate();
        EdECPublicKey edECPublicKey = (EdECPublicKey) ed25519KeyPair.getPublic();

        byte[] privateKeyBytes = edECPrivateKey.getBytes().orElseThrow(() -> new IllegalStateException("Could not get private key"));
        byte[] publicKeyXBytes = edECPublicKey.getPoint().getY().toByteArray();

        Base64URL base64UrlPrivateKeyD = Base64URL.encode(privateKeyBytes);
        Base64URL base64UrlPublicKeyX = Base64URL.encode(publicKeyXBytes);

        return new OctetKeyPair.Builder(Curve.Ed25519, base64UrlPublicKeyX)
                .d(base64UrlPrivateKeyD)
                .keyUse(KeyUse.SIGNATURE)
                .build();
    }
}