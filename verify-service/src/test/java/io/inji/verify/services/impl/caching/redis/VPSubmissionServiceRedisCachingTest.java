package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.submission.PresentationSubmissionDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import io.inji.verify.services.impl.VerifiablePresentationSubmissionServiceImpl;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.PresentationVerifier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = VPSubmissionServiceRedisCachingTest.CachingTestConfig.class)
public class VPSubmissionServiceRedisCachingTest {

    @Autowired
    private VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @MockBean
    private VPSubmissionRepository vpSubmissionRepository;

    @MockBean
    private RedisConfigProperties redisConfigProperties;

    @MockBean
    private VerifiablePresentationRequestService verifiablePresentationRequestService;

    @SpyBean
    private CacheManager cacheManager;

    @MockBean
    private CredentialsVerifier credentialsVerifier;

    @MockBean
    private PresentationVerifier presentationVerifier;

    @BeforeEach
    void setup() {
        Cache cache = cacheManager.getCache("vpSubmissionCache");
        if (cache != null) {
            cache.clear();
        }
        when(redisConfigProperties.isVpSubmissionPersisted()).thenReturn(true);
        when(redisConfigProperties.isVpSubmissionCacheEnabled()).thenReturn(true);
    }

    @Configuration
    @EnableCaching
    static class CachingTestConfig {

        @Bean
        public RedisConnectionFactory redisConnectionFactory() {
            return new LettuceConnectionFactory("localhost", 6379);
        }

        @Bean
        public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
            return RedisCacheManager.builder(redisConnectionFactory)
                    .cacheDefaults(cacheConfiguration())
                    .build();
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties props = new RedisConfigProperties();
            props.setVpSubmissionPersisted(true);
            props.setVpSubmissionCacheEnabled(true);
            return props;
        }

        @Bean
        public RedisCacheConfiguration cacheConfiguration() {
            return RedisCacheConfiguration.defaultCacheConfig()
                    .serializeValuesWith(
                            RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer())
                    );
        }

        @Bean
        public VerifiablePresentationSubmissionService verifiablePresentationSubmissionService(
                VPSubmissionRepository repository,
                RedisConfigProperties redisConfigProperties,
                VerifiablePresentationRequestService requestService,
                CredentialsVerifier credentialsVerifier,
                PresentationVerifier presentationVerifier
        ) {
            return new VerifiablePresentationSubmissionServiceImpl(
                    repository,
                    credentialsVerifier,
                    presentationVerifier,
                    requestService,
                    redisConfigProperties
            );
        }
    }

    @Test
    void shouldCacheVPResultByFirstRequestId() throws VPSubmissionNotFoundException {
        String transactionId = "tx-001";
        List<String> requestIds = List.of("req-001");

        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        VPSubmission mockSubmission = new VPSubmission("state", "vpToken", submissionDto);

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(mockSubmission));

        VPTokenResultDto result1 = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);
        VPTokenResultDto result2 = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(result1);
        assertNotNull(result2);

        verify(vpSubmissionRepository, times(1)).findAllById(requestIds);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(requestIds.getFirst());
        assertNotNull(cached);
    }

    @Test
    void shouldCallRepoForDifferentRequestIds() throws VPSubmissionNotFoundException {
        String tx1 = "tx-111";
        List<String> requestIds1 = List.of("req-001", "req-002");
        List<String> requestIds2 = List.of("req-003", "req-004");

        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        VPSubmission mockSubmission = new VPSubmission("state", "vpToken", submissionDto);

        when(vpSubmissionRepository.findAllById(requestIds1)).thenReturn(List.of(mockSubmission));
        when(vpSubmissionRepository.findAllById(requestIds2)).thenReturn(List.of(mockSubmission));

        verifiablePresentationSubmissionService.getVPResult(requestIds1, tx1);
        verifiablePresentationSubmissionService.getVPResult(requestIds2, tx1);

        verify(vpSubmissionRepository).findAllById(requestIds1);
        verify(vpSubmissionRepository).findAllById(requestIds2);
    }

    @Test
    void shouldReturnNullAndNotCacheWhenSubmissionNotFound() {
        List<String> requestIds = List.of("req-404");
        String transactionId = "tx-404";

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of());

        assertThrows(VPSubmissionNotFoundException.class, () ->
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId));

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(requestIds.getFirst());
        assertNull(cached);
    }

    @Test
    void shouldNotPersistSubmissionWhenPersistenceDisabled() {
        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        String state = "state-002";
        VPSubmissionDto dto = new VPSubmissionDto("vpToken", submissionDto, state);

        when(redisConfigProperties.isVpSubmissionPersisted()).thenReturn(false);
        when(redisConfigProperties.isVpSubmissionCacheEnabled()).thenReturn(true);

        verifiablePresentationSubmissionService.submit(dto);

        verify(vpSubmissionRepository, never()).save(any());
        verify(verifiablePresentationRequestService, times(1)).invokeVpRequestStatusListener(state);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(state);
        assertNotNull(cached);
    }

    @Test
    void shouldNotCacheWhenCacheDisabled() {
        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        String state = "state-003";
        VPSubmissionDto dto = new VPSubmissionDto("vpToken", submissionDto, state);

        when(redisConfigProperties.isVpSubmissionPersisted()).thenReturn(true);
        when(redisConfigProperties.isVpSubmissionCacheEnabled()).thenReturn(false);

        verifiablePresentationSubmissionService.submit(dto);

        verify(vpSubmissionRepository).save(any());
        verify(verifiablePresentationRequestService).invokeVpRequestStatusListener(state);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(state);
        assertNull(cached);
    }

    @Test
    void shouldNotCacheOrPersistWhenBothDisabled() {
        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        String state = "state-004";
        VPSubmissionDto dto = new VPSubmissionDto("vpToken", submissionDto, state);

        when(redisConfigProperties.isVpSubmissionPersisted()).thenReturn(false);
        when(redisConfigProperties.isVpSubmissionCacheEnabled()).thenReturn(false);

        verifiablePresentationSubmissionService.submit(dto);

        verify(vpSubmissionRepository, never()).save(any());
        verify(verifiablePresentationRequestService).invokeVpRequestStatusListener(state);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(state);
        assertNull(cached);
    }
}
