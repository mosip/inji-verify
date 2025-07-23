package io.inji.verify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;

@Configuration
@EnableCaching
public class RedisConfig {

    private final RedisConfigProperties redisConfigProperties;

    public RedisConfig(RedisConfigProperties redisConfigProperties) {
        this.redisConfigProperties = redisConfigProperties;
    }

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(java.time.Duration.ofHours(redisConfigProperties.getTtlHours()))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        return (builder) -> {
            if (redisConfigProperties.isVcSubmissionCacheEnabled()) {
                builder.withCacheConfiguration("vcSubmissionCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(redisConfigProperties.getVcSubmissionCacheTtlHours())));
            }
            if (redisConfigProperties.isVcWithVerificationCacheEnabled()) {
                builder.withCacheConfiguration("vcWithVerificationCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(redisConfigProperties.getVcWithVerificationCacheTtlHours())));
            }
            if (redisConfigProperties.isVpSubmissionCacheEnabled()) {
                builder.withCacheConfiguration("vpSubmissionCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(redisConfigProperties.getVpSubmissionCacheTtlHours())));
            }
            if (redisConfigProperties.isAuthRequestCacheEnabled()) {
                builder.withCacheConfiguration("authorizationRequestCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(redisConfigProperties.getAuthRequestCacheTtlHours())));
            }
            if (redisConfigProperties.isPresentationDefinitionCacheEnabled()) {
                builder.withCacheConfiguration("presentationDefinitionCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(redisConfigProperties.getPresentationDefinitionCacheTtlHours())));
            }
        };
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();
                template.setConnectionFactory(connectionFactory);
                template.setKeySerializer(new StringRedisSerializer());
                template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
                template.afterPropertiesSet();

        return template;
    }
}