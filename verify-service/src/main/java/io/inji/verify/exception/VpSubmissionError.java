package io.inji.verify.exception;

import lombok.Getter;

@Getter
public class VpSubmissionError extends Exception {
    private final String errorCode;
    private final String errorDescription;

    public VpSubmissionError(String errorCode, String errorDescription) {
        super(errorDescription);
        this.errorCode = errorCode;
        this.errorDescription =  errorDescription;
    }
}
