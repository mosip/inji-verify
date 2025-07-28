package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.dto.submission.VCSubmissionDto;
import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import io.inji.verify.models.VCSubmission;
import io.inji.verify.repository.VCSubmissionRepository;
import io.inji.verify.services.VCSubmissionService;
import io.inji.verify.services.impl.VCSubmissionServiceImpl;
import io.inji.verify.config.RedisConfigProperties;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.Objects;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(VCSubmissionServiceRedisCachingTest.CachingTestConfig.class)
@EnableCaching
class VCSubmissionServiceRedisCachingTest {

    @TestConfiguration
    @EnableCaching
    static class CachingTestConfig {
        @Bean
        public RedisConnectionFactory redisConnectionFactory() {
            return new LettuceConnectionFactory("localhost", 6379);
        }

        @Bean
        public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
            return RedisCacheManager.builder(redisConnectionFactory).build();
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties props = new RedisConfigProperties();
            props.setVcSubmissionCacheEnabled(true);
            return props;
        }

        @Bean
        public VCSubmissionService vcSubmissionService(
                VCSubmissionRepository vcSubmissionRepository,
                CredentialsVerifier verifier,
                RedisConfigProperties redisProps
        ) {
            return new VCSubmissionServiceImpl(vcSubmissionRepository, verifier, redisProps);
        }
    }

    @Autowired
    private VCSubmissionService vcSubmissionService;

    @MockBean
    private VCSubmissionRepository vcSubmissionRepository;

    @MockBean
    private CredentialsVerifier credentialsVerifier;

    @MockBean
    private RedisConfigProperties redisConfigProperties;

    @SpyBean
    private CacheManager cacheManager;

    @BeforeEach
    void clearCaches() {
        Objects.requireNonNull(cacheManager.getCache("vcSubmissionCache")).clear();
        Objects.requireNonNull(cacheManager.getCache("vcWithVerificationCache")).clear();
    }

    @Test
    void shouldCacheSubmitVC_whenCachingEnabled() {
        String transactionId = "txn-1234";
        String vc = "{\"vc\":\"payload\"}";
        VCSubmissionDto dto = new VCSubmissionDto(vc, transactionId);

        when(redisConfigProperties.isVcSubmissionCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isVcSubmissionPersisted()).thenReturn(false);

        VCSubmissionResponseDto response = vcSubmissionService.submitVC(dto);

        assertNotNull(response);
        assertEquals(transactionId, response.getTransactionId());

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vcSubmissionCache")).get(transactionId);
        assertNotNull(cached);
        VCSubmissionResponseDto cachedValue = (VCSubmissionResponseDto) cached.get();
        assertNotNull(cachedValue);
        assertEquals(transactionId, cachedValue.getTransactionId());
    }

    @Test
    void shouldCacheGetVcWithVerification_whenCachingEnabled() {
        String transactionId = "txn-5678";
        String vc = "{\"vc\":\"test\"}";
        VCSubmission submission = new VCSubmission(transactionId, vc);

        when(redisConfigProperties.isVcWithVerificationCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(true);

        when(vcSubmissionRepository.findById(transactionId)).thenReturn(Optional.of(submission));

        VerificationResult mockResult = mock(VerificationResult.class);
        when(mockResult.getVerificationStatus()).thenReturn(true);
        when(credentialsVerifier.verify(any(), eq(CredentialFormat.LDP_VC))).thenReturn(mockResult);

        VCSubmissionVerificationStatusDto result1 = vcSubmissionService.getVcWithVerification(transactionId);
        assertNotNull(result1);

        VCSubmissionVerificationStatusDto result2 = vcSubmissionService.getVcWithVerification(transactionId);
        assertNotNull(result2);

        verify(vcSubmissionRepository, times(1)).findById(transactionId);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vcWithVerificationCache"))
                .get(transactionId);
        assertNotNull(cached);
    }

    @Test
    void shouldNotCacheSubmitVC_whenCachingDisabled() {
        String transactionId = "txn-nocache";
        VCSubmissionDto dto = new VCSubmissionDto("{\"vc\":\"test\"}", transactionId);

        when(redisConfigProperties.isVcSubmissionCacheEnabled()).thenReturn(false);
        when(redisConfigProperties.isVcSubmissionPersisted()).thenReturn(false);

        VCSubmissionResponseDto response = vcSubmissionService.submitVC(dto);
        assertNotNull(response);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vcSubmissionCache")).get(transactionId);
        assertNull(cached);
    }

    @Test
    void shouldReturnNull_whenPersistenceFlagTrue_getVcWithVerification() {
        String transactionId = "txn-persisted";

        when(redisConfigProperties.isVcWithVerificationCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(true);

        VCSubmissionVerificationStatusDto result = vcSubmissionService.getVcWithVerification(transactionId);
        assertNull(result);
    }

    @Test
    void shouldGenerateTransactionIdAndPersistVC_whenIdIsNullAndPersistenceEnabled() {
        String vc = "{\"vc\":\"auto-gen\"}";
        VCSubmissionDto dto = new VCSubmissionDto(vc, null);

        when(redisConfigProperties.isVcSubmissionCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isVcSubmissionPersisted()).thenReturn(true);

        VCSubmissionResponseDto response = vcSubmissionService.submitVC(dto);

        assertNotNull(response);
        assertNotNull(response.getTransactionId());
        verify(vcSubmissionRepository).save(any(VCSubmission.class));

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vcSubmissionCache")).get(response.getTransactionId());
        assertNotNull(cached);
    }

    @Test
    void shouldReturnNull_whenVcSubmissionNotFound() {
        String transactionId = "txn-missing";

        when(redisConfigProperties.isVcWithVerificationCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isVcWithVerificationPersisted()).thenReturn(false);
        when(vcSubmissionRepository.findById(transactionId)).thenReturn(Optional.empty());

        VCSubmissionVerificationStatusDto result = vcSubmissionService.getVcWithVerification(transactionId);
        assertNull(result);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vcWithVerificationCache")).get(transactionId);
        assertNull(cached);
    }
}
