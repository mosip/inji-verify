package io.inji.verify.config;

import static org.junit.jupiter.api.Assertions.*;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import io.mosip.vercred.vcverifier.CredentialsVerifier;

@SpringBootTest
public class AppConfigTest {

    // @Autowired
    // private ApplicationContext context;

    // @Test
    // public void testCredentialsVerifierBean() {
    //     CredentialsVerifier credentialsVerifier = context.getBean(CredentialsVerifier.class);
    //     assertNotNull(credentialsVerifier);
    // }

    // @Test
    // public void testGsonBean() {
    //     Gson gson = context.getBean(Gson.class);
    //     assertNotNull(gson);
    // }
}