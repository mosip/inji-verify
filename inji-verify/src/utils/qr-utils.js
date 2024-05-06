import { scanFile } from "@openhealthnz-credentials/pdf-image-qr-scanner";
import {decodeData, generateQRData} from '@mosip/pixelpass';
import {HEADER_DELIMITER, SUPPORTED_QR_HEADERS} from "./config";

export const scanFilesForQr = async (selectedFile) => {
    let scanResult = { data: null, error: null };
    try {
        scanResult.data = await scanFile(selectedFile);
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
    console.log('Decoding: ', qrData);
    if (!(!!qrData)) return;
    let encodedData = qrData
    if (!!HEADER_DELIMITER) {
        const splitQrData = qrData.split(HEADER_DELIMITER);
        const header = splitQrData[0];
        if (SUPPORTED_QR_HEADERS.indexOf(header) === -1) return; // throw some error and handle it
        if (splitQrData.length !== 2) return; // throw some error and handle it
        encodedData = splitQrData[1];
    }
    const decodedData =  decodeData(encodedData);
    console.log('Decoded data: ', decodedData);
    return decodedData;
}

export const encodeData = (data) => generateQRData(data);
