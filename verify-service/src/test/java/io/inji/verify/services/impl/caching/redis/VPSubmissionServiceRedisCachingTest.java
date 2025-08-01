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
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@Slf4j
public class VPSubmissionServiceRedisCachingTest {

    @Autowired
    private VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @MockBean
    private VPSubmissionRepository vpSubmissionRepository;

    @SpyBean
    private CacheManager cacheManager;

    @MockBean
    private RedisConfigProperties redisConfigProperties;

    @MockBean
    private VerifiablePresentationRequestService verifiablePresentationRequestService;

    @BeforeEach
    void clearCache() {
        Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).clear();
        when(redisConfigProperties.isVpSubmissionPersisted()).thenReturn(true);
        when(redisConfigProperties.isVpSubmissionCacheEnabled()).thenReturn(true);
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
        System.out.println("✔ Redis cache contains key: vpSubmissionCache::" + requestIds.getFirst());
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

        verify(vpSubmissionRepository, times(1)).findAllById(requestIds1);
        verify(vpSubmissionRepository, times(1)).findAllById(requestIds2);
    }

    @Test
    void shouldReturnNullAndNotCacheWhenSubmissionNotFound() {
        List<String> requestIds = List.of("req-404");
        String transactionId = "tx-404";

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of());

        assertThrows(VPSubmissionNotFoundException.class, () ->
                verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId));

        Cache.ValueWrapper cached =
                Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(requestIds.getFirst());
        assertNull(cached, "Expected cache miss for non-existent submission.");
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
        log.info("Cache state: {}", cached);
        System.out.println("Cache state: {}" + cached);
        assertNotNull(cached, "Expected cache entry to be present when cache enabled");
    }

    @Test
    void shouldNotCacheWhenCacheDisabled() {
        PresentationSubmissionDto submissionDto = new PresentationSubmissionDto("id", "dId", new ArrayList<>());
        String state = "state-003";
        VPSubmissionDto dto = new VPSubmissionDto("vpToken", submissionDto, state);

        when(redisConfigProperties.isVpSubmissionPersisted()).thenReturn(true);
        when(redisConfigProperties.isVpSubmissionCacheEnabled()).thenReturn(false);

        verifiablePresentationSubmissionService.submit(dto);

        verify(vpSubmissionRepository, times(1)).save(any());
        verify(verifiablePresentationRequestService, times(1)).invokeVpRequestStatusListener(state);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(state);
        assertNull(cached, "Expected no cache entry when cache disabled");
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
        verify(verifiablePresentationRequestService, times(1)).invokeVpRequestStatusListener(state);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("vpSubmissionCache")).get(state);
        assertNull(cached, "Expected no cache entry when both cache and persistence disabled");
    }
}
