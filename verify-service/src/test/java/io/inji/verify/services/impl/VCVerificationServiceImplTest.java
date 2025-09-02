package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import io.mosip.vercred.vcverifier.utils.Util;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class VCVerificationServiceImplTest {

    private CredentialsVerifier credentialsVerifier;
    private VCVerificationServiceImpl service;

    @BeforeEach
    void setUp() {
        credentialsVerifier = mock(CredentialsVerifier.class);
        service = new VCVerificationServiceImpl(credentialsVerifier);
    }

    @Test
    void testVerify_WithSdJwtContentType_ReturnsSuccess() {
        String vc = "dummy-vc";
        String contentType = "application/vc+sd-jwt";

        VerificationResult mockResult = mock(VerificationResult.class);
        when(credentialsVerifier.verify(vc, CredentialFormat.VC_SD_JWT)).thenReturn(mockResult);

        // Mock Util.INSTANCE.getVerificationStatus
        Util utilMock = mock(Util.class);
        when(Util.INSTANCE.getVerificationStatus(mockResult)).thenReturn(VerificationStatus.SUCCESS);

        VCVerificationStatusDto result = service.verify(vc, contentType);

        assertEquals(VerificationStatus.SUCCESS, result.getVerificationStatus());
        verify(credentialsVerifier, times(1)).verify(vc, CredentialFormat.VC_SD_JWT);
    }

    @Test
    void testVerify_WithLdJsonContentType_ReturnsExpired() {
        String vc = "dummy-vc";
        String contentType = "application/ld+json";

        VerificationResult mockResult = mock(VerificationResult.class);
        when(credentialsVerifier.verify(vc, CredentialFormat.LDP_VC)).thenReturn(mockResult);
        when(Util.INSTANCE.getVerificationStatus(mockResult)).thenReturn(VerificationStatus.EXPIRED);

        VCVerificationStatusDto result = service.verify(vc, contentType);

        assertEquals(VerificationStatus.EXPIRED, result.getVerificationStatus());
        verify(credentialsVerifier, times(1)).verify(vc, CredentialFormat.LDP_VC);
    }

    @Test
    void testVerify_UnsupportedContentType_ThrowsException() {
        String vc = "dummy-vc";
        String contentType = "text/plain";

        IllegalArgumentException ex = org.junit.jupiter.api.Assertions.assertThrows(
                IllegalArgumentException.class,
                () -> service.verify(vc, contentType)
        );

        assertEquals("Unsupported Content-Type: " + contentType, ex.getMessage());
        verifyNoInteractions(credentialsVerifier);
    }
}
