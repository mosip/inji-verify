package io.inji.verify.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = OpenAPIConfig.class)
class OpenAPIConfigTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("OpenAPI bean should be correctly configured")
    void registrationOpenAPI_BeanConfiguration_Success() {
        OpenAPI openAPI = applicationContext.getBean(OpenAPI.class);

        assertNotNull(openAPI, "OpenAPI bean should not be null");

        Info info = openAPI.getInfo();
        assertNotNull(info, "Info object should not be null");
        assertEquals("Verifier API - Inji Verify", info.getTitle(), "Title should match");
        assertEquals("API for OpenID4VP verifier supporting direct_post and cross-device flow", info.getDescription(), "Description should match");
        assertEquals("1.0", info.getVersion(), "Version should match");

        assertTrue(applicationContext.containsBean("registrationOpenAPI"), "Bean 'registrationOpenAPI' should be present");
    }

    @Test
    @DisplayName("OpenAPI bean is a singleton")
    void registrationOpenAPI_IsSingleton() {
        OpenAPI openAPI1 = applicationContext.getBean(OpenAPI.class);
        OpenAPI openAPI2 = applicationContext.getBean(OpenAPI.class);

        assertEquals(openAPI1, openAPI2, "OpenAPI bean should be a singleton instance");
    }
}