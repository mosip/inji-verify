package io.inji.verify.services;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuthorizationRequestCacheServiceTest {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private AuthorizationRequestCacheService cacheService;

    @Autowired
    private RedisConfigProperties redisConfigProperties;

    @BeforeEach
    void clearCache() {
        cacheManager.getCache("authorizationRequestCache").clear();
    }

    @Test
    void shouldPutAuthorizationRequestInCache() {
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(
                "req-id", "txn-id", /* payload */ null, System.currentTimeMillis() + 10000
        );

        cacheService.cacheAuthorizationRequest(response);

        Object cached = cacheManager.getCache("authorizationRequestCache").get("txn-id").get();
        assertNotNull(cached);
        assertEquals("txn-id", ((AuthorizationRequestCreateResponse) cached).getTransactionId());
    }
}
