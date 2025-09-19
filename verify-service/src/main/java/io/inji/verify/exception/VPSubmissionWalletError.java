package io.inji.verify.exception;

import lombok.Getter;

@Getter
public class VPSubmissionWalletError extends Exception {
    private final String errorCode;
    private final String errorDescription;

    public VPSubmissionWalletError(String errorCode, String errorDescription) {
        super(errorDescription);
        this.errorCode = errorCode;
        this.errorDescription =  errorDescription;
    }
}
