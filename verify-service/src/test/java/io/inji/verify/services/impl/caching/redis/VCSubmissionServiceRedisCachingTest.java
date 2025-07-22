package io.inji.verify.services.impl.caching.redis;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ActiveProfiles;

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class VCSubmissionServiceRedisCachingTest {

    @TestConfiguration
    static class CachingTestConfig {
        @Bean
        public VCSubmissionService vcSubmissionService(
                VCSubmissionRepository vcSubmissionRepository,
                CredentialsVerifier credentialsVerifier) {
            return new VCSubmissionServiceImpl(vcSubmissionRepository, credentialsVerifier);
        }
    }

    @Autowired
    private VCSubmissionService vcSubmissionService;

    @MockBean
    private VCSubmissionRepository vcSubmissionRepository;

    @MockBean
    private CredentialsVerifier credentialsVerifier;

    @SpyBean
    private CacheManager cacheManager;

    @BeforeEach
    void setUp() {
        // Clear the cache before each test to ensure isolation
        Objects.requireNonNull(cacheManager.getCache("vcSubmissionCache")).clear();
    }

    @Test
    void shouldCacheGetVcWithVerificationResult() {
        // Arrange
        VCSubmission mockSubmission = new VCSubmission();
        mockSubmission.setTransactionId("txn-12345");
        mockSubmission.setVc("{\"credential\":\"test\"}");

        when(vcSubmissionRepository.findById("txn-12345"))
                .thenReturn(Optional.of(mockSubmission));

        VerificationResult mockVerificationResult = mock(VerificationResult.class);
        when(credentialsVerifier.verify(any(), eq(CredentialFormat.LDP_VC)))
                .thenReturn(mockVerificationResult);

        when(mockVerificationResult.getVerificationStatus()).thenReturn(true);
        when(mockVerificationResult.getVerificationErrorCode()).thenReturn(null);
        when(mockVerificationResult.getVerificationMessage()).thenReturn(null);

        // Act
        VCSubmissionVerificationStatusDto result1 = vcSubmissionService.getVcWithVerification("txn-12345");
        VCSubmissionVerificationStatusDto result2 = vcSubmissionService.getVcWithVerification("txn-12345");

        // Assert
        assertNotNull(result1);
        assertNotNull(result2);

        // This verifies caching: repo should only be hit once
        verify(vcSubmissionRepository, times(1)).findById("txn-12345");
    }
}
