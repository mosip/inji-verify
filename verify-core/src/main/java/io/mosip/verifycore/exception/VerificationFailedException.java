package io.mosip.verifycore.exception;

public class VerificationFailedException extends Exception{
    private static final String message = "Verification Failed";
    public VerificationFailedException() {
        super(message);
    }
}
