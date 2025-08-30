package io.inji.verify.services.impl.caching;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.services.AuthorizationRequestCacheService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.Objects;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = AuthorizationRequestCacheServiceTest.TestConfig.class)
public class AuthorizationRequestCacheServiceTest {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private AuthorizationRequestCacheService cacheService;

    @BeforeEach
    void clearCache() {
        Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).clear();
    }

    @Configuration
    @EnableCaching
    static class TestConfig {

        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("authorizationRequestCache");
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties props = new RedisConfigProperties();
            props.setAuthRequestCacheEnabled(true);
            return props;
        }

        @Bean
        public AuthorizationRequestCacheService authorizationRequestCacheService(
                RedisConfigProperties redisConfigProperties
        ) {
            return new AuthorizationRequestCacheService(redisConfigProperties);
        }
    }

    @Test
    void shouldPutAuthorizationRequestInCache() {
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(
                "req-id", "txn-id", null, System.currentTimeMillis() + 10000
        );

        cacheService.cacheAuthorizationRequest(response);

        Object cached = Objects.requireNonNull(Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).get("txn-id")).get();
        assertNotNull(cached);
        assertEquals("txn-id", ((AuthorizationRequestCreateResponse) cached).getTransactionId());
    }
}
