package io.inji.verify.dto.core;

import io.inji.verify.enums.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ErrorDto {
    ErrorCode errorCode;
    String errorMessage;
}
