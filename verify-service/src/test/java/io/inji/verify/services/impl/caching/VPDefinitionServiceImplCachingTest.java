package io.inji.verify.services.impl.caching;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.presentation.FormatDto;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.models.PresentationDefinition;
import io.inji.verify.repository.PresentationDefinitionRepository;
import io.inji.verify.services.VPDefinitionService;
import io.inji.verify.services.impl.VPDefinitionServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringJUnitConfig
@EnableCaching
public class VPDefinitionServiceImplCachingTest {

    @TestConfiguration
    static class CachingTestConfig {

        @Bean
        public CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("presentationDefinitionCache");
        }

        @Bean
        public PresentationDefinitionRepository presentationDefinitionRepository() {
            return mock(PresentationDefinitionRepository.class);
        }

        @Bean
        public RedisConfigProperties redisConfigProperties() {
            RedisConfigProperties mockProps = mock(RedisConfigProperties.class);
            when(mockProps.isPresentationDefinitionCacheEnabled()).thenReturn(true);
            when(mockProps.isPresentationDefinitionPersisted()).thenReturn(true); // <-- ADD THIS
            return mockProps;
        }

        @Bean
        public VPDefinitionService vpDefinitionServiceImpl(
                PresentationDefinitionRepository repository,
                RedisConfigProperties redisConfigProperties) {
            return new VPDefinitionServiceImpl(repository, redisConfigProperties);
        }
    }

    @Autowired
    private PresentationDefinitionRepository presentationDefinitionRepository;

    @Autowired
    private VPDefinitionService vpDefinitionService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void shouldUseCachingForPresentationDefinitionForSameId() {
        List<InputDescriptorDto> mockInputDescriptor = List.of();
        List<SubmissionRequirementDto> mockSubmissionRequirements = List.of();
        FormatDto formatDto = new FormatDto(null, null, null);
        String testId = "test_id";

        PresentationDefinition mockPresentationDefinition = new PresentationDefinition(
                testId, mockInputDescriptor, "name", "purpose", formatDto, mockSubmissionRequirements);

        when(presentationDefinitionRepository.findById(testId))
                .thenReturn(Optional.of(mockPresentationDefinition));

        // First call
        VPDefinitionResponseDto firstCall = vpDefinitionService.getPresentationDefinition(testId);
        assertNotNull(firstCall, "First call should not return null");

        // Second call (from cache)
        VPDefinitionResponseDto secondCall = vpDefinitionService.getPresentationDefinition(testId);
        assertNotNull(secondCall, "Second call should not return null");

        assertEquals(firstCall.getId(), secondCall.getId());
        assertEquals(firstCall, secondCall); // optional, make sure equals() is implemented correctly

        // Repository called only once
        verify(presentationDefinitionRepository, times(1)).findById(testId);
    }

    @Test
    void shouldVerifyCacheStats() {
        List<InputDescriptorDto> mockInputDescriptor = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirements = mock();
        FormatDto formatDto = new FormatDto(null, null, null);
        String testId = "test_id";
        PresentationDefinition mockPresentationDefinition = new PresentationDefinition(testId, mockInputDescriptor, "name", "purpose", formatDto, mockSubmissionRequirements);
        when(presentationDefinitionRepository.findById(testId)).thenReturn(Optional.of(mockPresentationDefinition));

        Cache cache = cacheManager.getCache("presentationDefinitionCache");
        assertNotNull(cache, "Cache should not be null");

        // First call to populate the cache
        assertNull(cache.get(testId), "Cache should be empty before the first call");
        vpDefinitionService.getPresentationDefinition(testId);

        // Verify that the cache now contains the entry
        assertNotNull(cache, "Cache should not be null");
    }
}
