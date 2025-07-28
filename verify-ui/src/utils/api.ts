import { ApiRequest, PresentationDefinition, QrData, VPRequestBody, VpRequestStatusApi } from "../types/data-types";

const generateNonce = (): string => {
  const dateTimeString = Date.now().toString();
  const nonceByte = new TextEncoder().encode(dateTimeString);
  const byteArray = Array.from(nonceByte);
  return window.btoa(String.fromCharCode(...byteArray));
};

export class api {
  static Host = window._env_.VERIFY_SERVICE_API_URL;

  static fetchVerifyCredentialOnline: ApiRequest ={
    url: () => api.Host + "/vc-verification",
    methodType: "POST",
    headers: () => {
      return {
        "Content-Type": "application/json",
      };
    },
  };

  static fetchVpRequest: ApiRequest = {
    url: () => api.Host + "/vp-request",
    methodType: "POST",
    headers: () => {
      return {
        "Content-Type": "application/json",
      };
    },
    body: {
      transactionId: "",
      clientId: window.location.origin,
      presentationDefinition: {
        id: "c4822b58-7fb4-454e-b827-f8758fe27f9a",
        purpose:
          "Relying party is requesting your digital ID for the purpose of Self-Authentication",
        format: {
          ldp_vc: {
            proof_type: ["RsaSignature2018"],
          },
        },
        input_descriptors: [],
      },
      nonce: generateNonce(),
    },
  };

  static fetchStatus: VpRequestStatusApi = {
    url: (reqId: string) => api.Host + `/vp-request/${reqId}/status`,
    methodType: "GET",
    headers: () => {
      return {
        "Content-Type": "application/json",
        "Connection": "close"
      };
    },
  };

  static fetchVpResult: ApiRequest = {
    url: (txnId: string) => api.Host + `/vp-result/${txnId}`,
    methodType: "GET",
    headers: () => {
      return {
        "Content-Type": "application/json"
      };
    },
  };
}

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
