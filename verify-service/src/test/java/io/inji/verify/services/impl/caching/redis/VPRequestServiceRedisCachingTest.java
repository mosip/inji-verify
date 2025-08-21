package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.AuthorizationRequestCacheService;
import io.inji.verify.services.KeyManagementService;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.impl.VerifiablePresentationRequestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = VPRequestServiceRedisCachingTest.CachingTestConfig.class)
@TestPropertySource(properties = "inji.vp-request.long-polling-timeout=30000")
class VPRequestServiceRedisCachingTest {

    @TestConfiguration
    @EnableCaching
    static class CachingTestConfig {

        @Bean
        public RedisConnectionFactory redisConnectionFactory() {
            return new LettuceConnectionFactory("localhost", 6379);
        }

        @Bean
        public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
            RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10))
                    .serializeValuesWith(
                            RedisSerializationContext.SerializationPair.fromSerializer(new JdkSerializationRedisSerializer()));
            return RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(config).build();
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties props = new RedisConfigProperties();
            props.setAuthRequestCacheEnabled(true);
            props.setAuthRequestPersisted(true);
            return props;
        }

        @Bean
        public AuthorizationRequestCacheService authorizationRequestCacheService(
                RedisConfigProperties redisConfigProperties) {
            return new AuthorizationRequestCacheService(redisConfigProperties);
        }

        @Bean
        public VerifiablePresentationRequestService verifiablePresentationRequestService(
                AuthorizationRequestCreateResponseRepository repo,
                RedisConfigProperties redisConfigProperties,
                AuthorizationRequestCacheService cacheService
        ) {
            return new VerifiablePresentationRequestServiceImpl(
                    mock(PresentationDefinitionRepository.class),
                    repo,
                    mock(VPSubmissionRepository.class),
                    redisConfigProperties,
                    cacheService,
                    mock(KeyManagementService.class)
            );
        }
    }

    @Autowired
    private VerifiablePresentationRequestService service;

    @MockBean
    private AuthorizationRequestCreateResponseRepository repository;

    @MockBean
    private RedisConfigProperties redisConfigProperties;

    @SpyBean
    private CacheManager cacheManager;

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
        when(redisConfigProperties.isAuthRequestCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isAuthRequestPersisted()).thenReturn(true);

        AuthorizationRequestCreateResponse result1 = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(result1);

        AuthorizationRequestCreateResponse result2 = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(result2);

        verify(repository, times(1)).findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
        verify(repository, times(1)).findById(REQUEST_ID);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).get(TRANSACTION_ID);
        assertNotNull(cached);
    }

    @Test
    void shouldCacheAuthorizationRequestOnCreate() {
        String transactionId = "txn-001";
        String requestId = "req-001";
        String clientId = "client-abc";
        long expiresAt = Instant.now().plusSeconds(300).toEpochMilli();
        String nonce = "random-nonce";

        VPRequestCreateDto createDto = new VPRequestCreateDto(clientId, transactionId, null, nonce, null);

        AuthorizationRequestResponseDto dto = new AuthorizationRequestResponseDto(clientId, null, null, nonce, null);
        AuthorizationRequestCreateResponse expectedEntity = new AuthorizationRequestCreateResponse(requestId, transactionId, dto, expiresAt);

        when(redisConfigProperties.isAuthRequestCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isAuthRequestPersisted()).thenReturn(true);
        when(repository.save(any())).thenReturn(expectedEntity);

        VPRequestResponseDto response = service.createAuthorizationRequest(createDto);
        assertEquals(transactionId, response.getTransactionId());

        Cache.ValueWrapper wrapper = Objects.requireNonNull(cacheManager.getCache("authorizationRequestCache")).get(transactionId);
        assertNotNull(wrapper);
    }

    @Test
    void shouldUseCacheOnGetLatestAuthorizationRequest() {
        AuthorizationRequestCreateResponse mockEntity = new AuthorizationRequestCreateResponse(
                REQUEST_ID, TRANSACTION_ID,
                new AuthorizationRequestResponseDto("client", null, null, "nonce", null),
                Instant.now().plusSeconds(600).toEpochMilli());

        when(redisConfigProperties.isAuthRequestCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isAuthRequestPersisted()).thenReturn(true);
        when(repository.findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID)).thenReturn(Collections.singletonList(mockEntity));
        when(repository.findById(REQUEST_ID)).thenReturn(Optional.of(mockEntity));

        AuthorizationRequestCreateResponse result1 = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(result1);

        AuthorizationRequestCreateResponse result2 = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(result2);

        verify(repository, times(1)).findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
        verify(repository, times(1)).findById(REQUEST_ID);
    }
}
