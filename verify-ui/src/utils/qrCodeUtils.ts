import { decode, decodeBinary } from "@mosip/pixelpass";
import { scanResult } from "../components/qrcode-verification/QRCodeVerification.types";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";


const SupportedFileTypes = ["png", "jpeg", "jpg", "pdf"];
const UploadFileSizeLimits = {
  min: 10000, // 10KB
  max: 5000000, // 5MB
};
export const FRAME_PROCESS_INTERVAL_MS = 100;
export const THROTTLE_FRAMES_PER_SEC = 500; // Throttle frame processing to every 500ms (~2 frames per second)
export const ZOOM_STEP = 2.5;
export const INITIAL_ZOOM_LEVEL = 0;
export const CONSTRAINTS_IDEAL_WIDTH = 2560;
export const CONSTRAINTS_IDEAL_HEIGHT = 1440;
export const CONSTRAINTS_IDEAL_FRAME_RATE = 30;
export const HEADER_DELIMITER = "";
export const SUPPORTED_QR_HEADERS = [""];
const ZIP_HEADER = "PK";
export const ScanSessionExpiryTime = 60000; // in milliseconds

export const acceptedFileTypes = SupportedFileTypes.map((ext) => `.${ext}`).join(", ");


export const vcVerification = async (credential: unknown, url: string) => {
  const body = JSON.stringify(credential);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  try {
    const response = await fetch(url + "/vc-verification", requestOptions);
    const data = await response.json();
    return data.verificationStatus;
  } catch (error) {
    console.error("Error occurred:", error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const vcSubmission = async (credential: unknown, url: string) => {
  const body = JSON.stringify(credential);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  try {
    const response = await fetch(url + "/vc-submission", requestOptions);
    const data = await response.json();
    return data.transactionId;
  } catch (error) {
    console.error("Error occurred:", error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const decodeQrData = async (qrData: Uint8Array) => {
  if (!qrData) return;
  let encodedData = qrData;
  if (HEADER_DELIMITER) {
    const splitQrData = new TextDecoder("utf-8").decode(qrData).split(HEADER_DELIMITER);
    const header = splitQrData[0];
    if (SUPPORTED_QR_HEADERS.indexOf(header) === -1) return; // throw some error and handle it
    if (splitQrData.length !== 2) return; // throw some error and handle it
    encodedData = new TextEncoder().encode(splitQrData[1]);
  }
  const decodedData = new TextDecoder("utf-8").decode(new Uint8Array(encodedData as unknown as ArrayBuffer));
  if (decodedData.startsWith(ZIP_HEADER)) {
    return await decodeBinary(encodedData);
  }
  return decode(decodedData);
};

export const OvpQrHeader = "INJI_OVP://";

export const extractRedirectUrlFromQrData = (qrData: string) => {
  // qr data format = OVP://payload:text-content
  const regex = new RegExp(`^${OvpQrHeader}(.*)$`);
  const match = qrData.match(regex);
  return match ? match[1] : null;
};

export const initiateOvpFlow = (redirectUri: string) => {
  const encodedOriginUrl = window.encodeURIComponent(window.location.origin);
  window.location.href = `${redirectUri}&client_id=${encodedOriginUrl}&redirect_uri=${encodedOriginUrl}/redirect`;
};

export const handleOvpFlow = async (qrData: string) => {
  const redirectUrl = extractRedirectUrlFromQrData(qrData);
  if (redirectUrl) {
    initiateOvpFlow(redirectUrl);
  } else {
    console.error("Failed to extract the redirect url from the qr data");
  }
};

let zxing: any = null;

const loadZxing = async () => {
  try {
    zxing = await window.ZXing();
  } catch (error) {
    console.error("Error loading ZXing:", error);
  }
};

loadZxing();

const readQRcodeFromImageFile = async (file:File, format:string, isPDF?:boolean) => {
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
      return bytes;
    }
  }
};

const readQRcodeFromPdf = async (file: File, format: string) => {
  const pdfData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  let result;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get canvas 2D context");
    }
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    const dataURL = canvas.toDataURL();
    const blob = await (await fetch(dataURL)).blob();
    const fileFromBlob = new File([blob], "tempFileName", { type: blob.type });
    const qrCode = await readQRcodeFromImageFile(fileFromBlob, format, true);
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

export const scanFilesForQr = async (
  selectedFile: File
): Promise<scanResult> => {
  const scanResult: scanResult = { data: null, error: null };
  const format: string = "QRCode";

  try {
    const fileType: string = selectedFile.type;

    if (fileType === "application/pdf") {
      scanResult.data = await readQRcodeFromPdf(selectedFile, format);
    } else {
      scanResult.data =
        (await readQRcodeFromImageFile(selectedFile, format)) ?? null;
    }
  } catch (error) {
    console.error("error:", error);
    scanResult.error = error instanceof Error ? new Error(error.message) : new Error("Unknown error");
  }

  return scanResult;
};

const getFileExtension = (fileName: string) =>
  fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

export const doFileChecks = (file: File | null): boolean => {
  if (!file) return false;
  let alert: string | null = null;

  // file format check
  const fileExtension = getFileExtension(file.name).toLowerCase();
  if (!SupportedFileTypes.includes(fileExtension)) {
    alert =
      "Unsupported file format. Allowed file formats are: png, jpeg, jpg, pdf.";
  }

  // file size check
  if (
    file.size < UploadFileSizeLimits.min ||
    file.size > UploadFileSizeLimits.max
  ) {
    alert =
      "File size not supported. The file size should be between 10 KB and 5 MB.";
  }

  if (alert) {
    throw new Error(alert);
  }
  return true;
};
