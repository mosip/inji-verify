import { decode, generateQRData } from "@mosip/pixelpass";
import { HEADER_DELIMITER, SUPPORTED_QR_HEADERS } from "./config";
import { pdfToQrData } from "./pdfToQrData";

const zxing = await window.ZXing();

const readBarcodes = async (file) => {
  let format = "QRCode";

  let arrayBuffer = await file.arrayBuffer();
  let u8Buffer = new Uint8Array(arrayBuffer);

  let zxingBuffer = zxing._malloc(u8Buffer.length);
  zxing.HEAPU8.set(u8Buffer, zxingBuffer);
  let results = zxing.readBarcodesFromImage(
    zxingBuffer,
    u8Buffer.length,
    true,
    format,
    0xff
  );
  zxing._free(zxingBuffer);

  if (results.size() === 0) {
    throw new Error("No " + ({ format } || "barcode") + " found");
  } else {
    for (let i = 0; i < results.size(); i += 1) {
      const { text } = results.get(i);
      return escapeTags(text);
    }
  }
};

function escapeTags(htmlStr) {
  return htmlStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


export const scanFilesForQr = async (selectedFile) => {
  let scanResult = { data: null, error: null };
  try {
    if (selectedFile.type === "application/pdf") {
      const qrResult = await pdfToQrData(selectedFile);
      scanResult.data = qrResult;
    } else {
      const qrData = await readBarcodes(selectedFile);
      scanResult.data = qrData;
    }
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
};

export const decodeQrData = (qrData) => {
  if (!!!qrData) return;
  let encodedData = qrData;
  if (!!HEADER_DELIMITER) {
    const splitQrData = qrData.split(HEADER_DELIMITER);
    const header = splitQrData[0];
    if (SUPPORTED_QR_HEADERS.indexOf(header) === -1) return; // throw some error and handle it
    if (splitQrData.length !== 2) return; // throw some error and handle it
    encodedData = splitQrData[1];
  }
  return decode(encodedData);
};

export const encodeData = (data) => generateQRData(data);
