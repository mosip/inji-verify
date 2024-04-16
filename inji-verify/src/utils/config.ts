import {AlertInfo} from "../types/data-types";

export const SUPPORTED_DID_METHODS = ["web"];

export const SUPPORTED_QR_HEADERS = [''];
export const HEADER_DELIMITER = '';

export const VerificationSteps = {
    ScanQrCodePrompt: 0,
    ActivateCamera: 1,
    Verifying: 2,
    DisplayResult: 3
}

export const AlertMessages = {
    qrUploadSuccess: {message: "QR code uploaded successfully!", severity: "success", autoHideDuration: 1200} as AlertInfo,
    sessionExpired: {message: "The scan session has expired due to inactivity. Please initiate a new scan.", severity: "error"} as AlertInfo,
    qrNotDetected: {message: "No MultiFormat Readers were able to detect the QR code.", severity: "error"} as AlertInfo,
    qrNotSupported: {message: "QR code format is not supported.", severity: "error"} as AlertInfo,
    unsupportedFileSize: {message: "QR code size is not supported. Please use a QR code within the specified dimensions.", severity: "error"} as AlertInfo,
};

export const ScanSessionExpiryTime = 60000; // in milliseconds

export const UploadFileSizeLimits = {
    min: 10000, // 10KB
    max: 5000000 // 5MB
}
