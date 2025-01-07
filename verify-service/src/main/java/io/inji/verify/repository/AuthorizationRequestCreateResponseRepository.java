package io.inji.verify.repository;

import java.util.List;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import io.inji.verify.models.AuthorizationRequestCreateResponse;

public interface AuthorizationRequestCreateResponseRepository extends JpaRepository<AuthorizationRequestCreateResponse, String> {
    List<AuthorizationRequestCreateResponse> findAllByTransactionIdOrderByExpiresAtDesc(@NotNull String transactionId);
}

