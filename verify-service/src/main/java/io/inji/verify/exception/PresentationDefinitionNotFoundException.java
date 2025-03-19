package io.inji.verify.exception;

import io.inji.verify.enums.ErrorCode;

public class PresentationDefinitionNotFoundException extends RuntimeException {
  private static final String message = ErrorCode.NO_PRESENTATION_DEFINITION.getErrorMessage();

  public PresentationDefinitionNotFoundException() {
    super(message);
  }
}