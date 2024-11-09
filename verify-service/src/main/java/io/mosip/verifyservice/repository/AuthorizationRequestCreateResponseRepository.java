package io.mosip.verifyservice.repository;

import io.mosip.verifycore.models.AuthorizationRequestCreateResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorizationRequestCreateResponseRepository extends JpaRepository<AuthorizationRequestCreateResponse, String> {
}

