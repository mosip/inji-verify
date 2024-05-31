import {AlertInfo, VerificationStep} from "../types/data-types";

export const SUPPORTED_DID_METHODS = ["web"];

export const SUPPORTED_QR_HEADERS = [''];
export const HEADER_DELIMITER = '';

export const VerificationSteps: any = {
    "SCAN": {
        QrCodePrompt: 1,
        ActivateCamera: 2,
        Verifying: 3,
        DisplayResult: 4
    },
    "UPLOAD": {
        QrCodePrompt: 1,
        Verifying: 2,
        DisplayResult: 3
    }
}

export const ScanMethodSteps = {
    ScanQrCodePrompt: 1,
    ActivateCamera: 2,
    Verifying: 3,
    DisplayResult: 4
}

export const UploadMethodSteps = {
    UploadQrCodePrompt: 1,
    Verifying: 2,
    DisplayResult: 3
}

export const AlertMessages = {
    qrUploadSuccess: {message: "QR code uploaded successfully!", severity: "success", autoHideDuration: 1200} as AlertInfo,
    sessionExpired: {message: "The scan session has expired due to inactivity. Please initiate a new scan.", severity: "error"} as AlertInfo,
    qrNotDetected: {message: "No MultiFormat Readers were able to detect the QR code.", severity: "error"} as AlertInfo,
    qrNotSupported: {message: "QR code format is not supported.", severity: "error"} as AlertInfo,
    unsupportedFileSize: {message: "QR code size is not supported. Please use a QR code within the specified dimensions.", severity: "error"} as AlertInfo,
    verificationMethodComingSoon: {message: "Coming soon", severity: "warning"} as AlertInfo,
};

export const ScanSessionExpiryTime = 60000; // in milliseconds

export const UploadFileSizeLimits = {
    min: 10000, // 10KB
    max: 5000000 // 5MB
}


export const VerificationStepsContent: VerificationStep[] = [
    {
        label: 'Select \'Scan QR Code\' or \'Upload QR Code\'',
        description: ['Tap \'Scan QR Code\' and scan to capture the QR code shown on your digital credentials/card.', 'Tap ‘Upload QR Code’ to upload the preferred file.'],
    },
    {
        label: 'Activate your device’s camera',
        description: 'Activate your device camera for scanning: A notification will be prompt to activate your device camera (Valid for ‘Scan QR Code’ feature only)',
    },
    {
        label: 'Verify document',
        description: 'Allow Inji Verify to verify & validate the digital document / card'
    },
    {
        label: 'View result',
        description: 'Check the validation result'
    }
];
