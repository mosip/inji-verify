package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.presentation.FormatDto;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.services.VPDefinitionService;
import io.inji.verify.services.impl.VPDefinitionServiceImpl;
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

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class VPDefinitionServiceRedisCachingTest {

    @TestConfiguration
    static class CachingTestConfig {

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties mockProps = mock(RedisConfigProperties.class);
            // Default behavior; can be overridden in individual tests
            when(mockProps.isPresentationDefinitionCacheEnabled()).thenReturn(true);
            when(mockProps.isPresentationDefinitionPersisted()).thenReturn(true);
            return mockProps;
        }

        @Bean
        public VPDefinitionService vpDefinitionService(
                PresentationDefinitionRepository repo,
                RedisConfigProperties redisConfigProperties
        ) {
            return new VPDefinitionServiceImpl(repo, redisConfigProperties);
        }
    }

    @Autowired
    private VPDefinitionService vpDefinitionService;

    @Autowired
    private RedisConfigProperties redisConfigProperties;

    @MockBean
    private PresentationDefinitionRepository presentationDefinitionRepository;

    @SpyBean
    private CacheManager cacheManager;

    @BeforeEach
    void clearCache() {
        Cache cache = cacheManager.getCache("presentationDefinitionCache");
        if (cache != null) cache.clear();
    }

    @Test
    void shouldCacheGetPresentationDefinition() {
        String testId = "test_id";

        // ✅ Ensure conditions are true
        when(redisConfigProperties.isPresentationDefinitionCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isPresentationDefinitionPersisted()).thenReturn(true);

        PresentationDefinition pd = new PresentationDefinition(
                testId, List.of(), "name", "purpose",
                new FormatDto(null, null, null), List.of()
        );
        when(presentationDefinitionRepository.findById(testId)).thenReturn(Optional.of(pd));

        VPDefinitionResponseDto first = vpDefinitionService.getPresentationDefinition(testId);
        VPDefinitionResponseDto second = vpDefinitionService.getPresentationDefinition(testId);

        assertNotNull(first);
        assertNotNull(second);
        verify(presentationDefinitionRepository, times(1)).findById(testId);

        Cache cache = cacheManager.getCache("presentationDefinitionCache");
        assertNotNull(cache);

        VPDefinitionResponseDto cached = cache.get(testId, VPDefinitionResponseDto.class); // 👈 safer
        assertNotNull(cached); // ✅ Should pass now
    }

    @Test
    void shouldReturnNullIfPersistenceDisabled() {
        when(redisConfigProperties.isPresentationDefinitionPersisted()).thenReturn(false);

        VPDefinitionResponseDto response = vpDefinitionService.getPresentationDefinition("any_id");
        assertNull(response);

        verify(presentationDefinitionRepository, never()).findById(anyString());
    }

    @Test
    void shouldReturnNullIfNotFoundInRepository() {
        String id = "missing_id";
        when(presentationDefinitionRepository.findById(id)).thenReturn(Optional.empty());

        VPDefinitionResponseDto result = vpDefinitionService.getPresentationDefinition(id);
        assertNull(result);
    }

    @Test
    void shouldNotCacheWhenCacheIsDisabled() {
        String testId = "non_cached_id";
        when(redisConfigProperties.isPresentationDefinitionCacheEnabled()).thenReturn(false);
        when(redisConfigProperties.isPresentationDefinitionPersisted()).thenReturn(true);

        FormatDto formatDto = new FormatDto(null, null, null);
        PresentationDefinition pd = new PresentationDefinition(
                testId,
                List.of(),
                "name",
                "purpose",
                formatDto,
                List.of()
        );

        when(presentationDefinitionRepository.findById(testId)).thenReturn(Optional.of(pd));

        VPDefinitionResponseDto first = vpDefinitionService.getPresentationDefinition(testId);
        VPDefinitionResponseDto second = vpDefinitionService.getPresentationDefinition(testId);

        assertNotNull(first);
        assertNotNull(second);
        verify(presentationDefinitionRepository, times(2)).findById(testId);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("presentationDefinitionCache")).get(testId);
        assertNull(cached);
    }

    @Test
    void shouldCacheOnlyWhenBothFlagsEnabled() {
        // Explicitly make both enabled
        when(redisConfigProperties.isPresentationDefinitionCacheEnabled()).thenReturn(true);
        when(redisConfigProperties.isPresentationDefinitionPersisted()).thenReturn(true);

        String testId = "conditional_id";
        FormatDto formatDto = new FormatDto(null, null, null);
        PresentationDefinition pd = new PresentationDefinition(
                testId,
                List.of(),
                "name",
                "purpose",
                formatDto,
                List.of()
        );

        when(presentationDefinitionRepository.findById(testId)).thenReturn(Optional.of(pd));

        VPDefinitionResponseDto call1 = vpDefinitionService.getPresentationDefinition(testId);
        VPDefinitionResponseDto call2 = vpDefinitionService.getPresentationDefinition(testId);

        verify(presentationDefinitionRepository, times(1)).findById(testId);
        assertNotNull(call1);
        assertNotNull(call2);

        Cache.ValueWrapper cached = cacheManager.getCache("presentationDefinitionCache").get(testId);
        assertNotNull(cached);
    }
}
