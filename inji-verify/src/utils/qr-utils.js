import { decode, generateQRData } from "@mosip/pixelpass";
import { HEADER_DELIMITER, SUPPORTED_QR_HEADERS } from "./config";
import { Html5Qrcode } from "html5-qrcode";
import { pdfToQrData } from "./pdfToQrData";
import { useAppDispatch } from "../redux/hooks";
import { verificationInit } from "../redux/features/verification/verification.slice";

export const scanFilesForQr = async (selectedFile) => {
  let scanResult = { data: null, error: null };
  const html5QrCode = new Html5Qrcode("upload-qr");

  try {
    if (selectedFile.type === "application/pdf") {
      const qrResult = await pdfToQrData(selectedFile);
      scanResult.data = qrResult;
    } else {
      const qrData = await html5QrCode.scanFile(selectedFile);
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

export const useQRScanner = () => {
  const dispatch = useAppDispatch();
  const config = {
    fps: 10,
    disableFlip: false,
    aspectRatio: 1.0
  };

  let html5QrCode;

  const initiateQrScanning = (timer) => {
    if (!html5QrCode?.getState()) {
      html5QrCode = new Html5Qrcode("reader");
      const qrCodeSuccessCallback = (decodedText) => {
        dispatch(
          verificationInit({
            qrReadResult: { qrData: decodedText, status: "SUCCESS" },
            flow: "SCAN",
          })
        );
        clearTimeout(timer);
        html5QrCode.stop();
      };

      html5QrCode
        .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch((e) => {
          console.error("Error occurred:", e.message);
          clearTimeout(timer);
          html5QrCode.stop();
        });
    }
  };

  const terminateScanning = () => html5QrCode.stop();

  return { initiateQrScanning, terminateScanning };
};
