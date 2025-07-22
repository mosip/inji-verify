package io.inji.verify.services.impl.caching.redis;

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
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class VPDefinitionServiceRedisCachingTest {

    @TestConfiguration
    static class CachingTestConfig {
        @Bean
        public VPDefinitionService vpDefinitionService(PresentationDefinitionRepository repo) {
            return new VPDefinitionServiceImpl(repo);
        }
    }

    @Autowired
    private VPDefinitionService vpDefinitionService;

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
        // Use real, non-mocked, serializable lists
        List<InputDescriptorDto> inputDescriptors = List.of(); // empty but valid
        List<SubmissionRequirementDto> submissionRequirements = List.of();
        FormatDto formatDto = new FormatDto(null, null, null);
        String testId = "test_id";

        PresentationDefinition mockPresentationDefinition = new PresentationDefinition(
                testId,
                inputDescriptors,
                "name",
                "purpose",
                formatDto,
                submissionRequirements
        );

        when(presentationDefinitionRepository.findById(testId))
                .thenReturn(Optional.of(mockPresentationDefinition));

        // Act
        VPDefinitionResponseDto result1 = vpDefinitionService.getPresentationDefinition(testId);
        VPDefinitionResponseDto result2 = vpDefinitionService.getPresentationDefinition(testId);

        // Assert
        assertNotNull(result1);
        assertNotNull(result2);
        verify(presentationDefinitionRepository, times(1)).findById(testId);

        Cache.ValueWrapper cached = Objects.requireNonNull(cacheManager.getCache("presentationDefinitionCache")).get(testId);
        assertNotNull(cached);
        System.out.println("✔ Redis contains cached value for: " + testId);
    }
}
