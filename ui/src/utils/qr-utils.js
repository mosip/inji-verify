import { decode, decodeBinary, generateQRData } from "@mosip/pixelpass";
import { HEADER_DELIMITER, SUPPORTED_QR_HEADERS } from "./config";
import * as pdfjsLib from "pdfjs-dist/webpack";

const zxing = await window.ZXing();
const ZIP_HEADER = "PK";

const readQRcodeFromImageFile = async (file, format, isPDF) => {
  const arrayBuffer = await file.arrayBuffer();
  const u8Buffer = new Uint8Array(arrayBuffer);
  const zxingBuffer = zxing._malloc(u8Buffer.length);
  zxing.HEAPU8.set(u8Buffer, zxingBuffer);
  const results = zxing.readBarcodesFromImage(
    zxingBuffer,
    u8Buffer.length,
    true,
    format,
    0xff
  );

  zxing._free(zxingBuffer);

  if (results.size() === 0) {
    if (!isPDF) {
      throw new Error(`No ${format} found`);
    }
  } else {
    for (let i = 0; i < results.size(); i += 1) {
      const { bytes } = results.get(i);
      return bytes
    }
  }
};

const readQRcodeFromPdf = async (file, format) => {
  const pdfData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  let result;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    const dataURL = canvas.toDataURL();
    const blob = await (await fetch(dataURL)).blob();
    const qrCode = await readQRcodeFromImageFile(blob, format, true);
    if (qrCode) {
      result = qrCode;
    }
  }
  if (result) {
    return result;
  } else {
    throw new Error(`No ${format} found`);
  }
};

export const scanFilesForQr = async (selectedFile) => {
  let scanResult = { data: null, error: null };
  const format = "QRCode";

  try {
    const fileType = selectedFile.type;

    if (fileType === "application/pdf") {
      const qrResult = await readQRcodeFromPdf(selectedFile, format);
      scanResult.data = qrResult;
    } else {
      const qrResult = await readQRcodeFromImageFile(selectedFile, format);
      scanResult.data = qrResult;
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

export const decodeQrData = async  (qrData) => {
  if (!!!qrData) return;
  let encodedData = qrData;
  if (!!HEADER_DELIMITER) {
    const splitQrData = qrData.split(HEADER_DELIMITER);
    const header = splitQrData[0];
    if (SUPPORTED_QR_HEADERS.indexOf(header) === -1) return; // throw some error and handle it
    if (splitQrData.length !== 2) return; // throw some error and handle it
    encodedData = splitQrData[1];
  }
  let decodedData = new TextDecoder("utf-8").decode(encodedData);
  if (decodedData.startsWith(ZIP_HEADER)){
    return await decodeBinary(encodedData)
  }
  return decode(decodedData);
};

export const encodeData = (data) => generateQRData(data);
