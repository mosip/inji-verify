package io.inji.verify.services.impl;

import io.mosip.vercred.vcverifier.utils.Util;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
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

@Service
public class VCSubmissionServiceImpl implements VCSubmissionService {

    final VCSubmissionRepository vcSubmissionRepository;
    final CredentialsVerifier credentialsVerifier;

    public VCSubmissionServiceImpl(VCSubmissionRepository vcSubmissionRepository, CredentialsVerifier credentialsVerifier) {
        this.vcSubmissionRepository = vcSubmissionRepository;
        this.credentialsVerifier = credentialsVerifier;
    }

    @Override
    @CacheEvict(value = "vcSubmissionCache", key = "#vcSubmitted.transactionId")
    public VCSubmissionResponseDto submitVC(VCSubmissionDto vcSubmitted) {
        String transactionId = vcSubmitted.getTransactionId() != null ? vcSubmitted.getTransactionId() : Utils.generateID(Constants.TRANSACTION_ID_PREFIX);
        String vc = vcSubmitted.getVc();
        VCSubmission vcSubmission = new VCSubmission(transactionId, vc);
        vcSubmissionRepository.save(vcSubmission);
        return new VCSubmissionResponseDto(vcSubmission.getTransactionId());
    }

    @Override
    @Cacheable(value = "vcSubmissionCache", key = "#transactionId")
    public VCSubmissionVerificationStatusDto getVcWithVerification(String transactionId) {
        return vcSubmissionRepository.findById(transactionId).map(vcSubmission -> {
            String vcJSON = vcSubmission.getVc();
            VerificationResult verificationResult = credentialsVerifier.verify(vcJSON, CredentialFormat.LDP_VC);
            return new VCSubmissionVerificationStatusDto(vcJSON, Util.Companion.getVerificationStatus(verificationResult));
        }).orElse(null);
    }
}
