import { ApiRequest } from "../types/data-types";

const generateNonce = (): string => {
  const dateTimeString = Date.now().toString();
  const nonceByte = new TextEncoder().encode(dateTimeString);
  const byteArray = Array.from(nonceByte);
  return window.btoa(String.fromCharCode(...byteArray));
};

export class api {
  static Host = window._env_.VERIFY_SERVICE_API_URL;

  static fetchVpRequest: ApiRequest = {
    url: () => api.Host + "/vp-request",
    methodType: "POST",
    headers: () => {
      return {
        "Content-Type": "application/json",
      };
    },
    body: JSON.stringify({
      transactionId: `txn_${crypto.randomUUID()}`,
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
        input_descriptors: [
          {
            id: "id card credential",
            format: {
              ldp_vc: {
                proof_type: ["Ed25519Signature2020"],
              },
            },
          },
        ],
      },
      nonce: generateNonce(),
    }),
  };

  static fetchStatus: ApiRequest = {
    url: (reqId: string) => api.Host + `/vp-request/${reqId}/status`,
    methodType: "GET",
    headers: () => {
      return {
        "Content-Type": "application/json"
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
