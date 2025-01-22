package io.inji.verify.exception;

import io.inji.verify.shared.Constants;

public class VPSubmissionNotFoundException extends Exception {
    private static final String message = Constants.ERR_101;

    public VPSubmissionNotFoundException() {
        super(message);
    }
}