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

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(java.time.Duration.ofHours(1))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        return (builder) -> builder
                .withCacheConfiguration("vcSubmissionCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(1)))
                .withCacheConfiguration("vpSubmissionCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(1)))
                .withCacheConfiguration("authorizationRequestCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(1)))
                .withCacheConfiguration("presentationDefinitionCache",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(java.time.Duration.ofHours(1)));
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