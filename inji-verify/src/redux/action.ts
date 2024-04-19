import {
    AlertInfo,
    ApplicationActionType,
    QrReadResult,
    VerificationFlow,
    VerificationResult
} from "../types/data-types";

export const ApplicationActions = {
    TRIGGER_QR_READ: "TRIGGER_QR_READ",
    QR_READ_COMPLETE: "QR_READ_COMPLETE",
    VERIFICATION_INIT: "TRIGGER_VERIFICATION",
    VERIFICATION_COMPLETE: "VERIFICATION_COMPLETE",
    GO_HOME_SCREEN: "GO_HOME_SCREEN",
    RAISE_ALERT: "RAISE_ALERT"
};

export const TriggerQrRead = (flow: VerificationFlow) => ({
    type: ApplicationActions.TRIGGER_QR_READ,
    payload: {flow},
});

export const QrReadComplete = (qrReadResult: QrReadResult) => ({
    type: ApplicationActions.QR_READ_COMPLETE,
    payload: {qrReadResult}
});

export const TriggerVerification = () => ({
    type: ApplicationActions.VERIFICATION_INIT
})

export const VerificationComplete = (verificationResult: VerificationResult) => ({
    type: ApplicationActions.VERIFICATION_COMPLETE,
    payload: {verificationResult}
});

export const GoHomeScreen = () => ({
    type: ApplicationActions.GO_HOME_SCREEN
});

export const RaiseAlert = (alert: AlertInfo) => ({
    type: ApplicationActions.RAISE_ALERT,
    payload: {alert}
});
