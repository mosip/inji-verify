export type QrScanResult = {
    data: string | null,
    error: string | null,
    status: QrReadStatus
}

export type QrReadStatus = "SUCCESS" | "NOT_READ" | "FAILED";

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
    description: string | string[]
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

export type VerificationMethod = 'SCAN' | 'UPLOAD' | "TO_BE_SELECTED";

export type InternetConnectionStatus = "ONLINE" | "OFFLINE" | "LOADING";

export type ApplicationState = {
    internetConnectionStatus: InternetConnectionStatus
}

export type VerificationState = {
    method: VerificationMethod,
    activeScreen: number, // Verification steps
    qrReadResult?: QrReadResult | undefined,
    verificationResult?: VerificationResult,
    alert?: AlertInfo
}

export type QrReadResult = {
    alert?: AlertInfo,
    qrData?: string,
    status: QrReadStatus
}

export type VerificationTrigger = {

}

export type VerificationResult = {
    vc?: any,
    vcStatus?: VcStatus
}
