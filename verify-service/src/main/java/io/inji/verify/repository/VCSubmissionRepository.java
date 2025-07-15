package io.inji.verify.repository;

import io.inji.verify.models.VCSubmission;
import org.jetbrains.annotations.NotNull;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VCSubmissionRepository extends JpaRepository<VCSubmission, String> {

    @NotNull
    @Override
    @Cacheable(value = "vcSubmissionCache", key = "#transactionId", unless = "#result == null")
    Optional<VCSubmission> findById(@NotNull String transactionId);

    @NotNull
    @Override
    @CachePut(value = "vcSubmissionCache", key = "#entity.transactionId")
    <S extends VCSubmission> S save(@NotNull S entity);

    @Override
    @CacheEvict(value = "vcSubmissionCache", key = "#transactionId")
    void deleteById(@NotNull String transactionId);
}
