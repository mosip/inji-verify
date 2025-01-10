package io.inji.verify.dto.submission;

import io.inji.verify.enums.ErrorCode;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.enums.VerificationStatus;
import io.inji.verify.models.VCResult;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class VPTokenResultDtoTest {
    @Test
    public void shouldTestConstructor() {
        String transactionId = "tx123";
        VPResultStatus vpResultStatus = VPResultStatus.SUCCESS;
        List<VCResult> vcResults = new ArrayList<>();
        vcResults.add(new VCResult("vc1", VerificationStatus.SUCCESS));
        vcResults.add(new VCResult("vc2", VerificationStatus.INVALID));
        ErrorCode errorCode = ErrorCode.ERR_100;
        String errorMessage = Constants.ERR_100;

        VPTokenResultDto resultDto = new VPTokenResultDto(transactionId, vpResultStatus, vcResults, errorCode, errorMessage);

        assertEquals(transactionId, resultDto.getTransactionId());
        assertEquals(vpResultStatus, resultDto.getVPResultStatus());
        assertEquals(vcResults, resultDto.getVCResults());
        assertEquals(errorCode,resultDto.getErrorCode());
        assertEquals(errorMessage,resultDto.getErrorMessage());
    }


}