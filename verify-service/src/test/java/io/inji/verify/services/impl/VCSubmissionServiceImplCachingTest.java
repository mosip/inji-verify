package io.inji.verify.services.impl;

import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import io.inji.verify.models.VCSubmission;
import io.inji.verify.repository.VCSubmissionRepository;
import io.inji.verify.services.VCSubmissionService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringJUnitConfig
@EnableCaching
public class VCSubmissionServiceImplCachingTest {

    @TestConfiguration
    static class CachingTestConfig {

        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("vcVerificationCache");
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
        public VCSubmissionService vcSubmissionService(
            VCSubmissionRepository vcSubmissionRepository,
            CredentialsVerifier credentialsVerifier
        ) {
            return new VCSubmissionServiceImpl(vcSubmissionRepository, credentialsVerifier);
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
    public void setUp() {
        // Clear the cache before each test
        Objects.requireNonNull(cacheManager.getCache("vcVerificationCache")).clear();

        reset(vcSubmissionRepository, credentialsVerifier);
    }

    @Test
    void getVcWithVerification_shouldUseCacheOnSubsequentCalls() {
        String TEST_VC_STRING = "{\"VC\":\"testVCString\"}";
        String TEST_TRANSACTION_ID = "transactionId12345";

        VCSubmission foundVCSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID))
            .thenReturn(Optional.of(foundVCSubmission));

        VerificationResult successResult = new VerificationResult(
            true,
            "Verification successful",
            ""
        );

        when(credentialsVerifier.verify(TEST_VC_STRING, CredentialFormat.LDP_VC))
            .thenReturn(successResult);

        // Act - First call should hit the repository and verifier
        VCSubmissionVerificationStatusDto result1 =
                vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);
        assertNotNull(result1);

        //The second call should hit the cache
        VCSubmissionVerificationStatusDto result2 =
                vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);
        assertNotNull(result2);

        verify(vcSubmissionRepository, times(1)).findById(TEST_TRANSACTION_ID);
        verify(credentialsVerifier, times(1)).verify(TEST_VC_STRING, CredentialFormat.LDP_VC);

        assertEquals(result1, result2,
                "The results should be equal as the second call should hit the cache.");
        assertEquals(result1.getVerificationStatus(), result2.getVerificationStatus(),
                     "The verification status should be the same for both calls.");
    }
}
