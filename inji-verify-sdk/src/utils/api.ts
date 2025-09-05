import {
  VPRequestBody,
  PresentationDefinition,
  QrData,
} from "../components/openid4vp-verification/OpenID4VPVerification.types";
import { vcSubmissionBody } from "../components/qrcode-verification/QRCodeVerification.types";

const generateNonce = (): string => {
  return btoa(Date.now().toString());
};

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
    console.error(error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const vcSubmission = async (
  credential: unknown,
  url: string,
  txnId?: string
) => {
  const requestBody: vcSubmissionBody = {
    vc: JSON.stringify(credential),
  };
  if (txnId) requestBody.transactionId = txnId;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url + "/vc-submission", requestOptions);
    const data = await response.json();
    return data.transactionId;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const vpRequest = async (
  url: string,
  clientId: string,
  txnId?: string,
  presentationDefinitionId?: string,
  presentationDefinition?: PresentationDefinition
) => {
  const requestBody: VPRequestBody = {
    clientId: clientId,
    nonce: generateNonce(),
  };

  if (txnId) requestBody.transactionId = txnId;
  if (presentationDefinitionId)
    requestBody.presentationDefinitionId = presentationDefinitionId;
  if (presentationDefinition)
    requestBody.presentationDefinition = presentationDefinition;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url + "/vp-request", requestOptions);
    if (response.status !== 201) throw new Error("Failed to create VP request");
    const data: QrData = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const vpRequestStatus = async (url: string, reqId: string) => {
  try {
    const response = await fetch(`${url}/vp-request/${reqId}/status`, {
      signal: AbortSignal.timeout(60000),
    });
    if (response.status !== 200) throw new Error("Failed to fetch status");
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      return { status: "TIMEOUT" };
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const vpResult = async (url: string, txnId: string) => {
  try {
    const response = await fetch(url + `/vp-result/${txnId}`);
    if (response.status !== 200) throw new Error("Failed to fetch VP result");
    const data = await response.json();
    return data.vcResults;
  } catch (error) {}
};
