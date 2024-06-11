import {AlertInfo} from "../types/data-types";

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

export const VerificationStepsContent: any = {
    SCAN: [
        {
            label: 'Scan QR Code',
            description: 'Tap "Scan" to start scanning the document or card with a QR code',
        },
        {
            label: 'Activate Camera and Position QR Code',
            description: 'Activate your device camera and hold the QR code within the frame to initiate verification.',
        },
        {
            label: 'Verification in Progress',
            description: 'The QR code verification is in progress.'
        },
        {
            label: 'View result',
            description: 'View the verification result.'
        }
    ],
    UPLOAD: [
        {
            label: 'Upload QR Code',
            description: 'Upload a file that contains a QR code',
        },
        {
            label: 'Verify document',
            description: 'Verification for the document or card is in progress.',
        },
        {
            label: 'View result',
            description: 'View the verification result.'
        }
    ]
};


export const AlertMessages = {
    qrUploadSuccess: {message: "QR code uploaded successfully!", severity: "success", autoHideDuration: 1200} as AlertInfo,
    sessionExpired: {message: "The scan session has expired due to inactivity. Please initiate a new scan.", severity: "error"} as AlertInfo,
    qrNotDetected: {message: "No MultiFormat Readers were able to detect the QR code.", severity: "error"} as AlertInfo,
    qrNotSupported: {message: "QR code format is not supported.", severity: "error"} as AlertInfo,
    unsupportedFileSize: {message: "File size not supported. The file size should be between 10 KB and 5 MB.", severity: "error"} as AlertInfo,
    verificationMethodComingSoon: {message: "Coming soon", severity: "warning"} as AlertInfo,
};

export const ScanSessionExpiryTime = 60000; // in milliseconds

export const UploadFileSizeLimits = {
    min: 10000, // 10KB
    max: 5000000 // 5MB
}

export const InternetConnectivityCheckEndpoint = "https://dns.google/";

export const InternetConnectivityCheckTimeout = 10000; //milliseconds
