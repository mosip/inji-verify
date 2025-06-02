package io.inji.verify.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI registrationOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Verifier API - Inji Verify")
                        .description("API for OpenID4VP verifier supporting direct_post and cross-device flow")
                        .version("1.0"));
    }
}