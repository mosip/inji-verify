package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.dto.submission.VCSubmissionDto;
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
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ActiveProfiles;

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
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
        String transactionId = "txn-12345";
        VCSubmission mockSubmission = new VCSubmission();
        mockSubmission.setTransactionId(transactionId);
        mockSubmission.setVc("{\"credential\":\"test\"}");

        when(vcSubmissionRepository.findById(transactionId))
                .thenReturn(Optional.of(mockSubmission));

        VerificationResult mockVerificationResult = mock(VerificationResult.class);
        when(credentialsVerifier.verify(any(), eq(CredentialFormat.LDP_VC)))
                .thenReturn(mockVerificationResult);

        when(mockVerificationResult.getVerificationStatus()).thenReturn(true);

        // Act
        VCSubmissionVerificationStatusDto result1 = vcSubmissionService.getVcWithVerification(transactionId);
        VCSubmissionVerificationStatusDto result2 = vcSubmissionService.getVcWithVerification(transactionId);

        // Assert
        assertNotNull(result1);
        assertNotNull(result2);
        verify(vcSubmissionRepository, times(1)).findById(transactionId);

        // ✅ Check cache via Spring CacheManager (Redis-backed)
        Cache cache = cacheManager.getCache("vcSubmissionCache");
        assertNotNull(cache);

        Cache.ValueWrapper cached = cache.get(transactionId);
        assertNotNull(cached, "Expected Redis cache to contain value for key: " + transactionId);
        System.out.println("✔ Spring Redis cache contains key: vcSubmissionCache::" + transactionId);
    }


    @Test
    void shouldReturnNullForNonExistentTransactionId() {
        // Arrange
        String nonExistentTransactionId = "txn-nonexistent";
        when(vcSubmissionRepository.findById(nonExistentTransactionId))
                .thenReturn(Optional.empty());

        // Act
        VCSubmissionVerificationStatusDto result = vcSubmissionService.getVcWithVerification(nonExistentTransactionId);

        // Assert
        assertNull(result);
    }

    @Test
    void shouldEvictCacheOnSubmitVC() {
        // Arrange
        String TEST_VC_STRING = "{\"VC\":\"testVCString\"}";
        String TEST_TRANSACTION_ID = "transactionId12345";
        VCSubmission mockSubmission = new VCSubmission(TEST_TRANSACTION_ID, TEST_VC_STRING);
//        mockSubmission.setTransactionId("txn-12345");
//        mockSubmission.setVc("{\"credential\":\"test\"}");

        // Stub repository and verifier
        when(vcSubmissionRepository.findById(TEST_TRANSACTION_ID)).thenReturn(Optional.of(mockSubmission));

        VerificationResult mockVerificationResult = mock(VerificationResult.class);
        when(credentialsVerifier.verify(any(), eq(CredentialFormat.LDP_VC)))
                .thenReturn(mockVerificationResult);
        when(mockVerificationResult.getVerificationStatus()).thenReturn(true);
        when(mockVerificationResult.getVerificationErrorCode()).thenReturn(null);
        when(mockVerificationResult.getVerificationMessage()).thenReturn(null);

        // Call method to cache
        vcSubmissionService.getVcWithVerification(TEST_TRANSACTION_ID);

        // Verify that the cache contains the entry
        assertNotNull(Objects.requireNonNull(cacheManager.getCache(
                "vcSubmissionCache")).get(TEST_TRANSACTION_ID));

        // Stub save
        when(vcSubmissionRepository.save(mockSubmission)).thenReturn(mockSubmission);

        // Act: should evict the cache
        vcSubmissionService.submitVC(new VCSubmissionDto(TEST_VC_STRING, TEST_TRANSACTION_ID));

        // Assert: cache should be evicted
        assertNull(Objects.requireNonNull(cacheManager.getCache(
                "vcSubmissionCache")).get(TEST_TRANSACTION_ID));
    }

    @Test
    void shouldRepopulateCacheAfterEviction() {
        String transactionId = "txn-evict";
        String vc = "{\"vc\":\"testVC\"}";
        VCSubmission submission = new VCSubmission(transactionId, vc);

        VerificationResult mockResult = mock(VerificationResult.class);
        when(mockResult.getVerificationStatus()).thenReturn(true);
        when(credentialsVerifier.verify(any(), eq(CredentialFormat.LDP_VC)))
                .thenReturn(mockResult);

        when(vcSubmissionRepository.findById(transactionId))
                .thenReturn(Optional.of(submission));

        // 1. Cache the value
        vcSubmissionService.getVcWithVerification(transactionId);
        verify(vcSubmissionRepository, times(1)).findById(transactionId);

        // 2. Submit VC to evict
        vcSubmissionService.submitVC(new VCSubmissionDto(vc, transactionId));

        // 3. Call again – should repopulate from repo
        vcSubmissionService.getVcWithVerification(transactionId);
        verify(vcSubmissionRepository, times(2)).findById(transactionId); // second hit
    }
}
