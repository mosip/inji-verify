package io.inji.verify.verifyservice.repository;

import io.inji.verify.verifyservice.models.VPSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VPSubmissionRepository extends JpaRepository<VPSubmission, String> {
}
