package io.inji.verify.exception;

import io.inji.verify.shared.Constants;

public class PresentationDefinitionNotFoundException extends Exception {
  private static final String message = Constants.ERR_201;

  public PresentationDefinitionNotFoundException() {
    super(message);
  }
}