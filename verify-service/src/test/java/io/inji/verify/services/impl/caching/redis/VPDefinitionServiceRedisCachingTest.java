package io.inji.verify.services.impl.caching.redis;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.presentation.FormatDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.services.VPDefinitionService;
import io.inji.verify.services.impl.VPDefinitionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = VPDefinitionServiceRedisCachingTest.CachingTestConfig.class)
class VPDefinitionServiceRedisCachingTest {

    @TestConfiguration
    @EnableCaching
    static class CachingTestConfig {

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties mockProps = mock(RedisConfigProperties.class);
            when(mockProps.isPresentationDefinitionCacheEnabled()).thenReturn(true);
            return mockProps;
        }

        @Bean
        public RedisConnectionFactory redisConnectionFactory() {
            return new LettuceConnectionFactory("localhost", 6379);
        }

        @Bean
        public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
            RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig();
            return RedisCacheManager.builder(redisConnectionFactory)
                    .cacheDefaults(config)
                    .build();
        }

        @Bean
        public VPDefinitionService vpDefinitionService(PresentationDefinitionRepository repo) {
            return new VPDefinitionServiceImpl(repo);
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

        when(redisConfigProperties.isPresentationDefinitionCacheEnabled()).thenReturn(true);

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

        VPDefinitionResponseDto cached = cache.get(testId, VPDefinitionResponseDto.class);
        assertNotNull(cached);
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
}
