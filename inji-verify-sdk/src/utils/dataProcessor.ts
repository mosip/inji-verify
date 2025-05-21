import { decode, decodeBinary } from "@mosip/pixelpass";
import {
  HEADER_DELIMITER,
  SUPPORTED_QR_HEADERS,
  ZIP_HEADER,
  OvpQrHeader,
} from "./constants";

export const decodeQrData = async (qrData: any) => {
  try {
    if (!qrData) throw new Error("No QR data provided");
    let encodedData = qrData;

    if (HEADER_DELIMITER) {
      const splitQrData = qrData.split(HEADER_DELIMITER);
      const header = splitQrData[0];

      if (!SUPPORTED_QR_HEADERS.includes(header)) {
        throw new Error("Unsupported QR header");
      }
      if (splitQrData.length !== 2) {
        throw new Error("Invalid QR format");
      }
      encodedData = splitQrData[1];
    }

    const decodedData = new TextDecoder("utf-8").decode(encodedData);
    if (decodedData.startsWith(ZIP_HEADER)) {
      return await decodeBinary(encodedData);
    }
    return decode(decodedData);
  } catch (error) {
    throw error instanceof Error
      ? new Error(error.message)
      : new Error(String(error));
  }
};

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
    throw new Error("Failed to extract the redirect url from the qr data");
  }
};