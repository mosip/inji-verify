package io.inji.verify.dto.core;

import io.inji.verify.enums.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ErrorDto {
    private String errorCode;
    private String errorMessage;

    public ErrorDto(ErrorCode errorCodeEnum) {
        this.errorCode = errorCodeEnum.getErrorCode();
        this.errorMessage = errorCodeEnum.getErrorMessage();
    }
}
