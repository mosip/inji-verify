package io.mosip.verifycore.utils;

import io.mosip.vercred.vcverifier.constants.CredentialValidatorConstants;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.verifycore.enums.VerificationStatus;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class UtilsTest {

    @Test
    public void shouldGenerateIDWithGivenPrefix() {
        String prefix = "TEST_";
        String id = Utils.generateID(prefix);

        assertTrue(id.startsWith(prefix));
        // Assert that the generated ID contains a UUID
        assertTrue(id.contains("-"));
    }

    @Test
    public void shouldReturnVerificationStatusSuccessIfVCVerificationIsSuccessful() {
        VerificationResult successResult = new VerificationResult(true, "","");
        VerificationStatus status = Utils.getVerificationStatus(successResult);

        assertEquals(VerificationStatus.SUCCESS, status);
    }

    @Test
    public void shouldReturnVerificationStatusExpiredIfVCIsExpired() {
        VerificationResult expiredResult = new VerificationResult(true,"", CredentialValidatorConstants.ERROR_CODE_VC_EXPIRED);
        VerificationStatus status = Utils.getVerificationStatus(expiredResult);

        assertEquals(VerificationStatus.EXPIRED, status);
    }

    @Test
    public void shouldReturnVerificationStatusFailedIfVCVerificationIsFailed() {
        VerificationResult invalidResult = new VerificationResult(false, "","");
        VerificationStatus status = Utils.getVerificationStatus(invalidResult);

        assertEquals(VerificationStatus.INVALID, status);
    }
}