package io.inji.verify.services;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthorizationRequestCacheService {

    private final RedisConfigProperties redisConfigProperties;

    @CachePut(
            value = "authorizationRequestCache",
            key = "#result.transactionId",
            unless = "#result == null",
            condition = "@redisConfigProperties.authRequestCacheEnabled"
    )
    public AuthorizationRequestCreateResponse cacheAuthorizationRequest(AuthorizationRequestCreateResponse response) {
        log.info("Caching authorization request with transaction ID: {}", response.getTransactionId());
        return response;
    }
}
