package io.inji.verify.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INVALID_TRANSACTION_ID("INVALID_TRANSACTION_ID","Invalid transaction ID, No requests found for given transaction ID."),
    NO_VP_SUBMISSION("NO_VP_SUBMISSION","No VP submission found for given transaction ID."),
    NO_AUTH_REQUEST("NO_AUTH_REQUEST","No Authorization request found for given request ID."),
    BOTH_ID_AND_PD_CANNOT_BE_NULL("BOTH_ID_AND_PD_CANNOT_BE_NULL","Both Presentation Definition and Presentation Definition ID cannot be empty."),
    NO_PRESENTATION_DEFINITION("NO_PRESENTATION_DEFINITION","No Presentation Definition found for given Presentation Definition ID.");

    private final String errorCode;
    private final String errorMessage;
}