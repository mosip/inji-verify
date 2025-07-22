package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.impl.VerifiablePresentationRequestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class VPRequestServiceRedisCachingTest {

    @Configuration
    @EnableCaching
    static class RedisTestConfig {

        @Bean
        public RedisConnectionFactory redisConnectionFactory() {
            return new LettuceConnectionFactory("localhost", 6379); // Assumes Redis is running locally
        }

        @Bean
        public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
            RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10))
                    .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new JdkSerializationRedisSerializer()));
            return RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(config).build();
        }

        @Bean
        public VerifiablePresentationRequestService verifiablePresentationRequestService(
                AuthorizationRequestCreateResponseRepository repo) {
            return new VerifiablePresentationRequestServiceImpl(null, repo, null);
        }
    }

    @Autowired
    private VerifiablePresentationRequestService service;

    @Autowired
    private CacheManager cacheManager;

    @MockBean
    private AuthorizationRequestCreateResponseRepository repository;

    private static final String TRANSACTION_ID = "test-transaction-id";
    private static final String REQUEST_ID = "test-request-id";

    @BeforeEach
    void clearRedisCache() {
        Cache cache = cacheManager.getCache("authorizationRequestCache");
        if (cache != null) cache.clear();
    }

    @Test
    void shouldCacheAuthorizationRequest() {
        AuthorizationRequestCreateResponse mockResponse = mock(AuthorizationRequestCreateResponse.class);

        when(repository.findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID))
                .thenReturn(Collections.singletonList(mockResponse));
        when(mockResponse.getRequestId()).thenReturn(REQUEST_ID);
        when(repository.findById(REQUEST_ID)).thenReturn(Optional.of(mockResponse));

        // First call
        AuthorizationRequestCreateResponse result1 = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(result1);

        // Second call (should hit Redis cache)
        AuthorizationRequestCreateResponse result2 = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(result2);

        verify(repository, times(1)).findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
        verify(repository, times(1)).findById(REQUEST_ID);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).get(TRANSACTION_ID);
        assertNotNull(cached);
        System.out.println("✔ Redis contains cached value for transactionId: " + TRANSACTION_ID);
    }
}
