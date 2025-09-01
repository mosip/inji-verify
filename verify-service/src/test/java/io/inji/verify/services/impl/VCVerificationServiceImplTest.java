package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


public class VCVerificationServiceImplTest {

    static VCVerificationServiceImpl service;
    static CredentialsVerifier mockCredentialsVerifier;

    private static final String LDP_VC = "{\"@context\":[],\"type\":[]}";
    private static final String SD_JWT_VC = "header.payload.signature~disclosures";

    @BeforeAll
    public static void beforeAll() {
        mockCredentialsVerifier = mock(CredentialsVerifier.class);
        service = new VCVerificationServiceImpl(mockCredentialsVerifier);
    }

    @Test
    public void shouldReturnSuccessForVerifiedVc() {
        VerificationResult mockResult = new VerificationResult(true, "", "");
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(mockResult);

        VCVerificationStatusDto statusDto = service.verify(LDP_VC);
        assertEquals(VerificationStatus.SUCCESS, statusDto.getVerificationStatus());

        statusDto = service.verify(SD_JWT_VC);
        assertEquals(VerificationStatus.SUCCESS, statusDto.getVerificationStatus());
    }

    @Test
    public void shouldReturnExpiredForVerifiedVcWhichIsExpired() {
        VerificationResult mockResult = new VerificationResult(true, "", CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED);
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(mockResult);

        VCVerificationStatusDto statusDto = service.verify(LDP_VC);
        assertEquals(VerificationStatus.EXPIRED, statusDto.getVerificationStatus());

        statusDto = service.verify(SD_JWT_VC);
        assertEquals(VerificationStatus.EXPIRED, statusDto.getVerificationStatus());
    }

    @Test
    public void shouldReturnInvalidForVcWhichIsInvalid() {
        VerificationResult mockResult = new VerificationResult(false, "", "");
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(mockResult);

        VCVerificationStatusDto statusDto = service.verify(LDP_VC);
        assertEquals(VerificationStatus.INVALID, statusDto.getVerificationStatus());

        statusDto = service.verify(SD_JWT_VC);
        assertEquals(VerificationStatus.INVALID, statusDto.getVerificationStatus());
    }

}
