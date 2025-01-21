package io.inji.verify.exception;

public class TokenMatchingFailedException extends Exception {
    private static final String message = "Verifiable presentation token matching failed";

    public TokenMatchingFailedException() {
        super(message);
    }
}