package io.inji.verify.services.impl.caching;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.impl.VerifiablePresentationRequestServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ContextConfiguration;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ContextConfiguration
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
            RedisConfigProperties properties = new RedisConfigProperties();
            // Enable persistence for testing
            properties.setAuthRequestPersisted(true);
            // Enable caching for testing
            properties.setAuthRequestCacheEnabled(true);
            return properties;
        }

        @Bean
        @Primary
        public VerifiablePresentationRequestService verifiablePresentationRequestService(
                AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository,
                RedisConfigProperties redisConfigProperties) {
            return new VerifiablePresentationRequestServiceImpl(
                    null,
                    authorizationRequestCreateResponseRepository,
                    null,
                    redisConfigProperties
            );
        }
    }

    @Autowired
    private VerifiablePresentationRequestService service;

    @MockBean
    private AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;

    private static final String TRANSACTION_ID = "test-transaction-id";
    private static final String REQUEST_ID = "test-request-id";

    @Test
    void shouldCacheAuthorizationRequest() {
        AuthorizationRequestCreateResponse mockResponse = mock(AuthorizationRequestCreateResponse.class);
        List<AuthorizationRequestCreateResponse> responses = Collections.singletonList(mockResponse);

        when(authorizationRequestCreateResponseRepository.findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID))
                .thenReturn(responses);
        when(mockResponse.getRequestId()).thenReturn(REQUEST_ID);
        when(authorizationRequestCreateResponseRepository.findById(REQUEST_ID))
                .thenReturn(Optional.of(mockResponse));

        // Act - First call
        AuthorizationRequestCreateResponse firstResult = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);

        // Assert first call
        assertNotNull(firstResult);

        // Act - Second call (should be from cache)
        AuthorizationRequestCreateResponse secondResult = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);

        // Assert second call
        assertNotNull(secondResult);

        // Verify repository calls
        verify(authorizationRequestCreateResponseRepository, times(1))
                .findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
        verify(authorizationRequestCreateResponseRepository, times(1))
                .findById(REQUEST_ID);
    }

    @Test
    void shouldHandleEmptyResponse() {
        List<AuthorizationRequestCreateResponse> emptyList = Collections.emptyList();
        when(authorizationRequestCreateResponseRepository.findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID))
                .thenReturn(emptyList);

        try {
            // Act - First call
            service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
            fail("Expected NoSuchElementException was not thrown");
        } catch (NoSuchElementException ignored) {}

        // Verify the first call
        verify(authorizationRequestCreateResponseRepository, times(1))
                .findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);

        try {
            // Act - Second call
            service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
            fail("Expected NoSuchElementException was not thrown");
        } catch (NoSuchElementException ignored) {}

        // Verify the second call (should not be cached)
        verify(authorizationRequestCreateResponseRepository, times(2))
                .findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
    }
}