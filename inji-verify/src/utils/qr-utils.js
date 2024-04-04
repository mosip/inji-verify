import { scanFile } from "@openhealthnz-credentials/pdf-image-qr-scanner";

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
