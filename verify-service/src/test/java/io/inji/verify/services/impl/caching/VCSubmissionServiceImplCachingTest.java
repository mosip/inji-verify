package io.inji.verify.services.impl.caching;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.submission.VCSubmissionDto;
import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import io.inji.verify.models.VCSubmission;
import io.inji.verify.repository.VCSubmissionRepository;
import io.inji.verify.services.VCSubmissionService;
import io.inji.verify.services.impl.VCSubmissionServiceImpl;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import java.util.Objects;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringJUnitConfig
@EnableCaching
class VCSubmissionServiceImplCachingTest {

    private final String TEST_TRANSACTION_ID = "transactionId12345";

    @TestConfiguration
    static class CachingTestConfig {
        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("vcSubmissionCache");
        }

        @Bean
        public VCSubmissionRepository vcSubmissionRepository() {
            return mock(VCSubmissionRepository.class);
        }

        @Bean
        public CredentialsVerifier credentialsVerifier() {
            return mock(CredentialsVerifier.class);
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties props = new RedisConfigProperties();
            props.setVcSubmissionCacheEnabled(true);
            props.setVcSubmissionPersisted(true);
            return props;
        }

        @Bean
        public VCSubmissionService vcSubmissionService(
                VCSubmissionRepository vcSubmissionRepository,
                CredentialsVerifier credentialsVerifier,
                RedisConfigProperties redisConfigProperties
        ) {
            return new VCSubmissionServiceImpl(vcSubmissionRepository, credentialsVerifier, redisConfigProperties);
        }
    }

    @Autowired
    private VCSubmissionService vcSubmissionService;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private VCSubmissionRepository vcSubmissionRepository;

    @Autowired
    private CredentialsVerifier credentialsVerifier;

    @BeforeEach
    void setUp() {
        cache().clear();
        reset(vcSubmissionRepository, credentialsVerifier);
    }

    private Cache cache() {
        return Objects.requireNonNull(cacheManager.getCache("vcSubmissionCache"), "Cache should not be null: " + "vcSubmissionCache");
    }

    @Test
    void getVcWithVerification_shouldUseCacheOnSubsequentCalls() {
        String TEST_VC_STRING = "{\"VC\":\"testVCString\"}";
        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID))
                .thenReturn(Optional.of(foundVCSubmission));

        VerificationResult successResult = new VerificationResult(true, "Verification successful", "");
        when(credentialsVerifier.verify(TEST_VC_STRING, CredentialFormat.LDP_VC))
                .thenReturn(successResult);

        VCSubmissionVerificationStatusDto result1 = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);
        assertNotNull(result1);

        VCSubmissionVerificationStatusDto result2 = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);
        assertNotNull(result2);

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verify(credentialsVerifier, times(1)).verify(TEST_VC_STRING, CredentialFormat.LDP_VC);
        assertEquals(result1, result2);
    }

    @Test
    void getVcWithVerification_shouldReturnNullWhenNotFound() {
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID))
                .thenReturn(Optional.empty());

        VCSubmissionVerificationStatusDto result = vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        assertNull(result);
        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verify(credentialsVerifier, never()).verify(any(), any());
    }

    @Test
    void submitVC_shouldNotCacheWhenResultIsNull() {
        VCSubmissionDto dto = new VCSubmissionDto(null, null);
        VCSubmissionResponseDto result = vcSubmissionService.submitVC(dto);
        assertNotNull(result);

        VCSubmissionResponseDto cached = cache()
                .get(result.getTransactionId(), VCSubmissionResponseDto.class);
        assertNotNull(cached);
    }
}