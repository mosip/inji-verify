package io.inji.verify.services.impl.caching;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.services.AuthorizationRequestCacheService;
import io.inji.verify.services.JwtService;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.impl.VerifiablePresentationRequestServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = VPRequestServiceImplCachingTest.TestConfig.class)
@TestPropertySource(properties = {"inji.vp-request.long-polling-timeout=30000"})
class VPRequestServiceImplCachingTest {

    @Configuration
    @EnableCaching
    static class TestConfig {

        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("authorizationRequestCache");
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties props = mock(RedisConfigProperties.class);
            when(props.isAuthRequestCacheEnabled()).thenReturn(true);
            when(props.isAuthRequestPersisted()).thenReturn(true);
            return props;
        }

        @Bean
        public AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository() {
            return mock(AuthorizationRequestCreateResponseRepository.class);
        }

        @Bean
        public JwtService jwtService() {
            return mock(JwtService.class);
        }

        @Bean
        public AuthorizationRequestCacheService authorizationRequestCacheService(
                RedisConfigProperties redisConfigProperties
        ) {
            return new AuthorizationRequestCacheService(redisConfigProperties);
        }

        @Bean
        public VerifiablePresentationRequestService verifiablePresentationRequestService(
                AuthorizationRequestCreateResponseRepository repository,
                RedisConfigProperties redisConfigProperties,
                JwtService jwtService,
                AuthorizationRequestCacheService cacheService
        ) {
            return new VerifiablePresentationRequestServiceImpl(
                    null, repository, null, redisConfigProperties, jwtService, cacheService
            );
        }
    }

    @Autowired
    private VerifiablePresentationRequestService service;

    @Autowired
    private AuthorizationRequestCreateResponseRepository repository;

    private static final String TRANSACTION_ID = "test-transaction-id";
    private static final String REQUEST_ID = "test-request-id";

    @Test
    void shouldCacheAuthorizationRequest() {
        AuthorizationRequestCreateResponse realResponse = new AuthorizationRequestCreateResponse() {
            @Override
            public String getRequestId() {
                return REQUEST_ID;
            }
        };

        List<AuthorizationRequestCreateResponse> responses = Collections.singletonList(realResponse);

        when(repository.findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID))
                .thenReturn(responses);
        when(repository.findById(REQUEST_ID))
                .thenReturn(Optional.of(realResponse));

        AuthorizationRequestCreateResponse first = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        AuthorizationRequestCreateResponse second = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);

        assertNotNull(first);
        assertNotNull(second);

        verify(repository, atLeastOnce()).findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
        verify(repository, atMost(1)).findById(REQUEST_ID);
    }

    @Test
    void shouldHandleEmptyResponse() {
        when(repository.findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID))
                .thenReturn(Collections.emptyList());

        assertThrows(NoSuchElementException.class, () -> service.getLatestAuthorizationRequestFor(TRANSACTION_ID));
        assertThrows(NoSuchElementException.class, () -> service.getLatestAuthorizationRequestFor(TRANSACTION_ID));

        verify(repository, times(2)).findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
    }
}
