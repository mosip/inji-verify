package io.inji.verify.exception;

import lombok.Getter;

@Getter
public class VpSubmissionException extends Exception {
    private final String errorCode;
    private final String errorDescription;

    public VpSubmissionException(String errorCode, String errorDescription) {
        super(errorDescription);
        this.errorCode = errorCode;
        this.errorDescription =  errorDescription;
    }
}
