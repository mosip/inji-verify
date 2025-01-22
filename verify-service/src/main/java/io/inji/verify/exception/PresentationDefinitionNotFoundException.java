package io.inji.verify.exception;

import io.inji.verify.shared.Constants;

public class PresentationDefinitionNotFoundException extends RuntimeException {
  private static final String message = Constants.ERR_201;

  public PresentationDefinitionNotFoundException() {
    super(message);
  }
}