package io.inji.verify.services.impl.caching;

import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.services.AuthorizationRequestCacheService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import java.util.Objects;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AuthorizationRequestCacheServiceTest {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private AuthorizationRequestCacheService cacheService;

    @BeforeEach
    void clearCache() {
        Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).clear();
    }

    @Test
    void shouldPutAuthorizationRequestInCache() {
        AuthorizationRequestCreateResponse response = new AuthorizationRequestCreateResponse(
                "req-id", "txn-id", /* payload */ null, System.currentTimeMillis() + 10000
        );

        cacheService.cacheAuthorizationRequest(response);

        Object cached = Objects.requireNonNull(Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).get("txn-id")).get();
        assertNotNull(cached);
        assertEquals("txn-id", ((AuthorizationRequestCreateResponse) cached).getTransactionId());
    }
}
