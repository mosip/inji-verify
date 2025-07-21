package io.inji.verify.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "inji.verify.redis")
@Data
public class RedisConfigProperties {
    private boolean vcSubmissionCacheEnabled = true;
    private boolean vpSubmissionCacheEnabled = true;
    private boolean authRequestCacheEnabled = true;
    private boolean presentationDefinitionCacheEnabled = true;

    private int ttlHours = 1;
    private int maxSize = 100;
    private String host = "localhost";
    private int port = 6379;
    private String password = "";
    private boolean ssl = true;
}
