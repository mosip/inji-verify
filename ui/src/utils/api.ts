import { ApiRequest } from "../types/data-types";

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export class api {
  static Host = "https://8065-2409-4073-2ebd-fe49-7d37-2889-9710-ad09.ngrok-free.app";

  static fetchRequestUri: ApiRequest = {
    url: () => api.Host + "/v1/verify/vp-request",
    methodType: "POST",
    headers: () => {
      return {
        "Content-Type": "application/json",
      };
    },
    body: JSON.stringify({
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
    }),
  };
}
