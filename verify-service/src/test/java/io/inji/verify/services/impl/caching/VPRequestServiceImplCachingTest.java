package io.inji.verify.services.impl.caching;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.repository.AuthorizationRequestCreateResponseRepository;
import io.inji.verify.services.JwtService;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.impl.VerifiablePresentationRequestServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
            properties.setAuthRequestPersisted(true);
            properties.setAuthRequestCacheEnabled(true);
            return properties;
        }

        @Bean
        @Primary
        public VerifiablePresentationRequestService verifiablePresentationRequestService(
                AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository,
                RedisConfigProperties redisConfigProperties,
                JwtService jwtService) {
            return new VerifiablePresentationRequestServiceImpl(
                    null,
                    authorizationRequestCreateResponseRepository,
                    null,
                    redisConfigProperties,
                    jwtService
            );
        }
    }

    @Autowired
    private VerifiablePresentationRequestService service;

    @MockBean
    private AuthorizationRequestCreateResponseRepository authorizationRequestCreateResponseRepository;

    @MockBean
    private JwtService jwtService;

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

        AuthorizationRequestCreateResponse firstResult = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(firstResult);

        AuthorizationRequestCreateResponse secondResult = service.getLatestAuthorizationRequestFor(TRANSACTION_ID);
        assertNotNull(secondResult);

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

        assertThrows(NoSuchElementException.class, () ->
                service.getLatestAuthorizationRequestFor(TRANSACTION_ID)
        );

        assertThrows(NoSuchElementException.class, () ->
                service.getLatestAuthorizationRequestFor(TRANSACTION_ID)
        );

        verify(authorizationRequestCreateResponseRepository, times(2))
                .findAllByTransactionIdOrderByExpiresAtDesc(TRANSACTION_ID);
    }
}
