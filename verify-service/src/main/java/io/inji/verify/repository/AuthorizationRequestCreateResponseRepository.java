package io.inji.verify.repository;

import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.shared.Constants;
import org.jetbrains.annotations.NotNull;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorizationRequestCreateResponseRepository extends JpaRepository<AuthorizationRequestCreateResponse, String> {
    @Cacheable(cacheNames = Constants.CACHE_NAME, key = "#transactionId")
    List<AuthorizationRequestCreateResponse> findAllByTransactionIdOrderByExpiresAtDesc(@NotNull String transactionId);

    @NotNull
    @Override
    @Cacheable(value = Constants.CACHE_NAME, key = "requestId")
    Optional<AuthorizationRequestCreateResponse> findById(@NotNull String requestId);
}

