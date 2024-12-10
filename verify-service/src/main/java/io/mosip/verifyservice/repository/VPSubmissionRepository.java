package io.mosip.verifyservice.repository;

import io.mosip.verifycore.models.VPSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VPSubmissionRepository extends JpaRepository<VPSubmission, String> {
}
