package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.dto.submission.PresentationSubmissionDto;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class VPSubmissionServiceRedisCachingTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public VerifiablePresentationSubmissionService verifiablePresentationSubmissionService(
                VPSubmissionRepository vpSubmissionRepository,
                CredentialsVerifier credentialsVerifier,
                PresentationVerifier presentationVerifier,
                VerifiablePresentationRequestService verifiablePresentationRequestService) {
            return new VerifiablePresentationSubmissionServiceImpl(
                    vpSubmissionRepository,
                    credentialsVerifier,
                    presentationVerifier,
                    verifiablePresentationRequestService);
        }
    }

    @Autowired
    private VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @MockBean
    private VPSubmissionRepository vpSubmissionRepository;

    @SpyBean
    private CacheManager cacheManager;

    @BeforeEach
    void clearCache() {
        Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).clear();
    }

    @Test
    void shouldCacheVPResultByTransactionId() throws VPSubmissionNotFoundException {
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

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(transactionId);
        assertNotNull(cached);
        System.out.println("✔ Redis cache contains key: vpSubmissionCache::" + transactionId);
    }

    @Test
    void shouldCallRepoForDifferentTransactionIds() throws VPSubmissionNotFoundException {
        String tx1 = "tx-111", tx2 = "tx-222";
        List<String> requestIds = List.of("req-002");

        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        VPSubmission mockSubmission = new VPSubmission("state", "vpToken", submissionDto);

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(mockSubmission));

        verifiablePresentationSubmissionService.getVPResult(requestIds, tx1);
        verifiablePresentationSubmissionService.getVPResult(requestIds, tx2);

        verify(vpSubmissionRepository, times(2)).findAllById(requestIds);
    }

    @Test
    void shouldReturnNullAndNotCacheWhenSubmissionNotFound() {
        List<String> requestIds = List.of("req-404");
        String transactionId = "tx-404";

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of());

        assertThrows(VPSubmissionNotFoundException.class, () ->
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId));

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(transactionId);
        assertNull(cached, "Expected cache miss for non-existent submission.");
    }
}
