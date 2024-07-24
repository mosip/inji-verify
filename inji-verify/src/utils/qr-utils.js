import {decode, generateQRData} from '@mosip/pixelpass';
import {HEADER_DELIMITER, SUPPORTED_QR_HEADERS} from "./config";
import QrScanner from 'qr-scanner';

export const scanFilesForQr = async (selectedFile) => {
    let scanResult = { data: null, error: null };
    try {
        const data = await QrScanner.scanImage(selectedFile)
        .then(result => result)
        .catch(error => console.log(error || 'No QR code found.'));
        scanResult.data = data;
    } catch (e) {
        // Example Error Handling
        if (e?.name === "InvalidPDFException") {
            scanResult.error = "Invalid PDF";
        } else if (e instanceof Event) {
            scanResult.error = "Invalid Image";
        } else {
            scanResult.error = "Unknown error:" + e;
        }
    }
    return scanResult;
}

export const decodeQrData = (qrData) => {
    if (!(!!qrData)) return;
    let encodedData = qrData
    if (!!HEADER_DELIMITER) {
        const splitQrData = qrData.split(HEADER_DELIMITER);
        const header = splitQrData[0];
        if (SUPPORTED_QR_HEADERS.indexOf(header) === -1) return; // throw some error and handle it
        if (splitQrData.length !== 2) return; // throw some error and handle it
        encodedData = splitQrData[1];
    }
    return decode(encodedData);
}

export const encodeData = (data) => generateQRData(data);
