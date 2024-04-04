export type QrScanResult = {
    data: string | null,
    error: string | null
}

export type VcStatus = {
    status: "OK" | "NOK" | "Verifying";
    checks: {
        active: string | null;
        revoked: "OK" | "NOK";
        expired: "OK" | "NOK";
        proof: "OK" | "NOK";
    }[];
}

export type InjiStepperStep = {
    label: string,
    description: string
}

export type CardPositioning = {
    top?: number,
    right?: number,
    bottom?: number,
    left?: number
}
