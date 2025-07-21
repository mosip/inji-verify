package io.inji.verify.services.impl;

import io.inji.verify.dto.submission.PresentationSubmissionDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.PresentationVerifier;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringJUnitConfig
@EnableCaching
public class VPSubmissionServiceImplCachingTest {

    @Autowired
    private VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @TestConfiguration
    static class CachingTestConfig {

        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("vpSubmissionCache");
        }

        @Bean
        public VPSubmissionRepository vpSubmissionRepository() {
            return mock(VPSubmissionRepository.class);
        }

        @Bean
        public CredentialsVerifier credentialsVerifier() {
            return mock(CredentialsVerifier.class);
        }

        @Bean
        public PresentationVerifier presentationVerifier() {
            return mock(PresentationVerifier.class);
        }

        @Bean
        public VerifiablePresentationRequestService verifiablePresentationRequestService() {
            return mock(VerifiablePresentationRequestService.class);
        }

        @Bean
        public VerifiablePresentationSubmissionService verifiablePresentationSubmissionService(
                VPSubmissionRepository vpSubmissionRepository,
                CredentialsVerifier credentialsVerifier,
                PresentationVerifier presentationVerifier,
                VerifiablePresentationRequestService verifiablePresentationRequestService
        ) {
            return new VerifiablePresentationSubmissionServiceImpl(
                    vpSubmissionRepository,
                    credentialsVerifier,
                    presentationVerifier,
                    verifiablePresentationRequestService);
        }

    }

    @Autowired
    private CredentialsVerifier credentialsVerifier;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private VPSubmissionRepository vpSubmissionRepository;

    @BeforeEach
    public void setUp() {
        Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).clear();
        reset(vpSubmissionRepository, credentialsVerifier);
    }

    @Test
    void getVPResult_shouldUseCacheForSameRequestIdAndTransactionId() throws VPSubmissionNotFoundException {
        String TEST_VP_TOKEN = "vpToken123";
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        PresentationSubmissionDto presentationSubmission = new PresentationSubmissionDto(
                "id",
                "dId",// Assuming no descriptor map for simplicity
                new ArrayList<>()  // Assuming no input descriptors for simplicity
        );

        VPSubmission vpSubmission = new VPSubmission("state123", TEST_VP_TOKEN, presentationSubmission);
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));

        VPTokenResultDto result1 =
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(result1);

        VPTokenResultDto result2 =
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(result2);

        // Verify that the second call uses the cache
        verify(vpSubmissionRepository, times(1)).findAllById(requestIds);
        assertEquals(result1.getVpResultStatus(), result2.getVpResultStatus());
    }

    @Test
    void getVPResult_shouldNotUseCacheForDifferentTransactionId() throws VPSubmissionNotFoundException {
        String TEST_VP_TOKEN = "vpToken123";
        List<String> requestIds = List.of("req123");
        String transactionId1 = "tx123";
        String transactionId2 = "tx456";

        PresentationSubmissionDto presentationSubmission = new PresentationSubmissionDto(
                "id",
                "dId",// Assuming no descriptor map for simplicity
                new ArrayList<>()  // Assuming no input descriptors for simplicity
        );

        VPSubmission vpSubmission = new VPSubmission("state123", TEST_VP_TOKEN, presentationSubmission);
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));

        VPTokenResultDto result1 =
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId1);

        assertNotNull(result1);

        VPTokenResultDto result2 =
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId2);

        assertNotNull(result2);

        // Verify that the second call uses the cache
        verify(vpSubmissionRepository, times(2)).findAllById(requestIds);
        assertEquals(result1.getVpResultStatus(), result2.getVpResultStatus());
    }
}
