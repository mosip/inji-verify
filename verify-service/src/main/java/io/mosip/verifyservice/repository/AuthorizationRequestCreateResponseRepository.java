package io.mosip.verifyservice.repository;

import io.mosip.verifycore.models.AuthorizationRequestCreateResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorizationRequestCreateResponseRepository extends JpaRepository<AuthorizationRequestCreateResponse, String> {
    Optional<AuthorizationRequestCreateResponse> findFirstByTransactionIdOrderByExpiresAtDesc(@NotNull String transactionId);
}

