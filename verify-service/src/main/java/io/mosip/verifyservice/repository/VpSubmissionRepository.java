package io.mosip.verifyservice.repository;

import io.mosip.verifycore.models.VpSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VpSubmissionRepository extends JpaRepository<VpSubmission, String> {
}
