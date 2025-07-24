package io.inji.verify.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "inji.verify.redis")
@Data
public class RedisConfigProperties {
    private boolean vcSubmissionCacheEnabled;
    private boolean vcWithVerificationCacheEnabled;
    private boolean vpSubmissionCacheEnabled;
    private boolean authRequestCacheEnabled;
    private boolean presentationDefinitionCacheEnabled;

    private boolean vcSubmissionPersisted;
    private boolean vcWithVerificationPersisted;
    private boolean vpSubmissionPersisted;
    private boolean authRequestPersisted;
    private boolean presentationDefinitionPersisted;

    private int vcSubmissionCacheTtlHours;
    private int vcWithVerificationCacheTtlHours;
    private int vpSubmissionCacheTtlHours;
    private int authRequestCacheTtlHours;
    private int presentationDefinitionCacheTtlHours;

    private int ttlHours = 1;
    private int maxSize = 1000;
    private String host = "localhost";
    private int port = 6379;
    private String password = "";
    private boolean ssl = false;
}
