export type QrScanResult = {
    data: string | null,
    error: string | null
}

export type ScanStatus = "Success" | "NotScanned" | "Failed";

export type VcStatus = {
    status: "OK" | "NOK" | "Verifying";
    checks: {
        active: string | null;
        revoked: "OK" | "NOK";
        expired: "OK" | "NOK";
        proof: "OK" | "NOK";
    }[];
}

export type VerificationStep = {
    label: string,
    description: string
}

export type CardPositioning = {
    top?: number,
    right?: number,
    bottom?: number,
    left?: number
}

export type AlertSeverity = "success" | "info" | "warning" | "error" | undefined;

export type AlertInfo = {
    message?: string,
    severity?: AlertSeverity,
    open?: boolean,
    autoHideDuration?: number
}

export type ApplicationActionType = 'TRIGGER_QR_READ' | 'QR_READ_COMPLETE' | 'TRIGGER_VERIFICATION' | 'VERIFICATION_COMPLETE' | 'GO_HOME_SCREEN' | 'RAISE_ALERT';

export type VerificationFlow = 'SCAN' | 'UPLOAD' | "TO_BE_SELECTED";

export type ApplicationAction = {
    type: ApplicationActionType,
    payload: ApplicationState
}

export type ApplicationState = {
    flow: VerificationFlow,
    activeScreen: number, // Verification steps
    qrReadResult?: QrReadResult | undefined,
    verificationResult?: VerificationResult,
    alert?: AlertInfo
}

export type QrReadResult = {
    alert?: AlertInfo,
    qrData?: string
}

export type VerificationTrigger = {

}

export type VerificationResult = {
    vc: any,
    vcStatus: VcStatus
}
