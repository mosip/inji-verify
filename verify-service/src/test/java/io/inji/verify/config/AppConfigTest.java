package io.inji.verify.config;

import static org.junit.jupiter.api.Assertions.*;

import com.google.gson.Gson;
import io.mosip.vercred.vcverifier.PresentationVerifier;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.context.ApplicationContext;
import io.mosip.vercred.vcverifier.CredentialsVerifier;

@SpringBootTest
@TestPropertySource(properties =
        {
                "inji.vp-request.long-polling-timeout = 1000",
                "spring.datasource.url = jdbc:h2:mem:verifydb",
                "spring.datasource.driverClassName = org.h2.Driver",
                "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
                "spring.jpa.hibernate.ddl-auto = create"
        })
public class AppConfigTest {

     @Autowired
     private ApplicationContext context;

     @Test
     public void testCredentialsVerifierBean() {
         CredentialsVerifier credentialsVerifier = context.getBean(CredentialsVerifier.class);
         assertNotNull(credentialsVerifier);
     }

    @Test
    public void testPresentationVerifierBean() {
        PresentationVerifier presentationVerifier = context.getBean(PresentationVerifier.class);
        assertNotNull(presentationVerifier);
    }


    @Test
     public void testGsonBean() {
         Gson gson = context.getBean(Gson.class);
         assertNotNull(gson);
     }
}