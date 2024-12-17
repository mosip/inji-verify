package io.inji.verify.services;

import io.inji.verify.dto.verification.VerificationStatusDto;
import io.inji.verify.singletons.CredentialsVerifierSingleton;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.inji.verify.enums.VerificationStatus;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


public class CredentialVerificationServiceImplTest {
    static CredentialsVerifierSingleton mockSingleton;
    static CredentialVerificationServiceImpl service;
    static CredentialsVerifier mockCredentialsVerifier;

    @BeforeAll
    public static void beforeAll(){
        mockSingleton = mock(CredentialsVerifierSingleton.class);
        mockCredentialsVerifier = mock(CredentialsVerifier.class);
        when(mockSingleton.getInstance()).thenReturn(mockCredentialsVerifier);
        service = new CredentialVerificationServiceImpl();
    }

    @Test
    public void shouldReturnSuccessForVerifiedVc() {

        VerificationResult mockResult = new VerificationResult(true, "","");
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(mockResult);

        CredentialVerificationServiceImpl service = new CredentialVerificationServiceImpl();
        service.credentialsVerifierSingleton = mockSingleton;

        VerificationStatusDto statusDto = service.verify("some_vc");

        assertEquals(VerificationStatus.SUCCESS, statusDto.getVerificationStatus());
    }

    @Test
    public void shouldReturnExpiredForVerifiedVcWhichIsExpired() {
        VerificationResult mockResult = new VerificationResult(true,"" , CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED);
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(mockResult);

        service.credentialsVerifierSingleton = mockSingleton;

        VerificationStatusDto statusDto = service.verify("some_vc");
        assertEquals(VerificationStatus.EXPIRED, statusDto.getVerificationStatus());
    }

    @Test
    public void shouldReturnInvalidForVcWhichIsInvalid() {
        // ... similar to the previous tests, but with an invalid result
        VerificationResult mockResult = new VerificationResult(false, "","");
        when(mockCredentialsVerifier.verify(anyString(), any(CredentialFormat.class))).thenReturn(mockResult);

        service.credentialsVerifierSingleton = mockSingleton;

        VerificationStatusDto statusDto = service.verify("some_vc");
        // ...
        assertEquals(VerificationStatus.INVALID, statusDto.getVerificationStatus());
    }
}