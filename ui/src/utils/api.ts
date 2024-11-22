import { ApiRequest } from "../types/data-types";

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export class api {
  static Host = "http://localhost:8080";

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
        submissionRequirements: [
          {
            name: "Citizenship Information",
            rule: "pick",
            count: 1,
            from: "A",
          },
        ],
        inputDescriptors: [
          {
            id: "id card credential",
            group: ["A"],
            format: {
              ldp_vc: {
                proof_type: ["Ed25519Signature2018"],
              },
            },
            constraints: {
              fields: [
                {
                  path: ["$.type"],
                  filter: {
                    type: "string",
                    pattern: "farmer",
                  },
                },
              ],
            },
          },
          {
            id: "passport credential",
            format: {
              jwt_vc_json: {
                alg: ["RS256"],
              },
            },
            group: ["A"],
            constraints: {
              fields: [
                {
                  path: ["$.vc.type"],
                  filter: {
                    type: "string",
                    pattern: "PassportCredential",
                  },
                },
              ],
            },
          },
        ],
      },
    }),
  };
}
