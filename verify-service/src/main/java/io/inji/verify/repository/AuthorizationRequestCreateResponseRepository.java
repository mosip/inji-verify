package io.inji.verify.repository;

import io.inji.verify.models.AuthorizationRequestCreateResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorizationRequestCreateResponseRepository extends JpaRepository<AuthorizationRequestCreateResponse, String> {
    List<AuthorizationRequestCreateResponse> findAllByTransactionIdOrderByExpiresAtDesc(@NotNull String transactionId);
}

