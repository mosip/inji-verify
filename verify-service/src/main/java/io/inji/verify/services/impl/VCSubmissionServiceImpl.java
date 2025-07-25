package io.inji.verify.services.impl;

import io.inji.verify.config.RedisConfigProperties;
import io.inji.verify.dto.submission.VCSubmissionDto;
import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.dto.submission.VCSubmissionVerificationStatusDto;
import io.inji.verify.models.VCSubmission;
import io.inji.verify.repository.VCSubmissionRepository;
import io.inji.verify.services.VCSubmissionService;
import io.inji.verify.shared.Constants;
import io.inji.verify.utils.Utils;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.utils.Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VCSubmissionServiceImpl implements VCSubmissionService {

    final VCSubmissionRepository vcSubmissionRepository;
    final CredentialsVerifier credentialsVerifier;
    final RedisConfigProperties redisConfigProperties;

    public VCSubmissionServiceImpl(VCSubmissionRepository vcSubmissionRepository, CredentialsVerifier credentialsVerifier, RedisConfigProperties redisConfigProperties) {
        this.vcSubmissionRepository = vcSubmissionRepository;
        this.credentialsVerifier = credentialsVerifier;
        this.redisConfigProperties = redisConfigProperties;
    }

    @Override
    @CachePut(value = "vcSubmissionCache",
            key = "#result.transactionId",
            unless = "#result == null",
            condition = "@redisConfigProperties.vcSubmissionCacheEnabled")
    public VCSubmissionResponseDto submitVC(VCSubmissionDto vcSubmitted) {
        String transactionId = vcSubmitted.getTransactionId() != null ? vcSubmitted.getTransactionId() : Utils.generateID(Constants.TRANSACTION_ID_PREFIX);
        String vc = vcSubmitted.getVc();
        VCSubmission vcSubmission = new VCSubmission(transactionId, vc);

        if (redisConfigProperties.isVcSubmissionPersisted()) {
            // If the submission is persisted, we save it to the repository
            log.info("Persisting VC submission with transaction ID: {}", transactionId);
            vcSubmissionRepository.save(vcSubmission);
        } else {
            // If not persisted, we only cache it
            log.info("VC submission is not persisted");
        }

        return new VCSubmissionResponseDto(vcSubmission.getTransactionId());
    }

    @Override
    @Cacheable(value = "vcWithVerificationCache",
            key = "#transactionId",
            unless = "#result == null",
            condition = "@redisConfigProperties.vcWithVerificationCacheEnabled")
    public VCSubmissionVerificationStatusDto getVcWithVerification(String transactionId) {
        if (!redisConfigProperties.isVcWithVerificationPersisted()) {
            log.warn("VC with verification is not persisted, cannot retrieve " +
                    "for transaction ID from repository: {}", transactionId);
            return null;
        }

        return vcSubmissionRepository.findById(transactionId).map(vcSubmission -> {
            String vcJSON = vcSubmission.getVc();
            VerificationResult verificationResult = credentialsVerifier.verify(vcJSON, CredentialFormat.LDP_VC);
            return new VCSubmissionVerificationStatusDto(vcJSON, Util.Companion.getVerificationStatus(verificationResult));
        }).orElse(null);
    }
}
