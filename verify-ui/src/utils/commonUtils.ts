import { claim, credentialSubject, VCWrapper, QrData } from "../types/data-types";
import { InsuranceCredentialRenderOrder, farmerLandCredentialRenderOrder, farmerCredentialRenderOrder, MosipVerifiableCredentialRenderOrder } from "./config";

export const getPresentationDefinition = (data: QrData) => {
  return (
    `client_id=${data.authorizationDetails.clientId}` +
    `&response_type=${data.authorizationDetails.responseType}` +
    `&response_mode=direct_post` +
    `&nonce=${data.authorizationDetails.nonce}` +
    `&state=${data.requestId}` +
    `&response_uri=${window.location.origin + window._env_.VERIFY_SERVICE_API_URL + data.authorizationDetails.responseUri}` +
    `${data.authorizationDetails.presentationDefinitionUri ? 
      `&presentation_definition_uri=${window.location.origin + window._env_.VERIFY_SERVICE_API_URL + data.authorizationDetails.presentationDefinitionUri}` : 
      `&presentation_definition=${JSON.stringify(data.authorizationDetails.presentationDefinition)}`}` +
    `&client_metadata={"client_name":"${window.location.origin}", "vp_formats": {}}`
  );
};

export const getDetailsOrder = (vc: any) => {
  const type = vc.type[1];
  const credential = vc.credentialSubject;
  switch (type) {
    case "InsuranceCredential":
    case "LifeInsuranceCredential":
      return InsuranceCredentialRenderOrder.map((key) => {
        if (key in credential) {
          return {
            key,
            value: credential[key as keyof credentialSubject] || "N/A",
          };
        }
        return { key, value: "N/A" };
      });
    case "farmer":
      return farmerLandCredentialRenderOrder.flatMap((key) => {
        if (typeof key === "string") {
          return {
            key,
            value: credential[key as keyof typeof vc] || "N/A",
          };
        } else if (typeof key === "object" && key !== null) {
          const [farmKey, farmOrder] = Object.entries(key)[0];
          if (
            farmKey in credential &&
            typeof credential[farmKey] === "object"
          ) {
            return farmOrder.map((farmField) => ({
              key: farmField,
              value: credential[farmKey][farmField] || "N/A",
            }));
          }
          return { key: farmKey, value: "N/A" };
        }
        return { key, value: "N/A" };
      });
    case "FarmerCredential":
      return farmerCredentialRenderOrder.map((key) => {
        if (key in credential) {
          return { key, value: credential[key as keyof credentialSubject] || "N/A" };
        }
        return { key, value: "N/A" };
      });
    case "MOSIPVerifiableCredential":
    case "MockVerifiableCredential":
      return MosipVerifiableCredentialRenderOrder.map((key) => {
        if (key in credential) {
          
          if(typeof(credential[key])=="object"){
            return { key, value: credential[key as keyof credentialSubject][0].value || "N/A" };
          }
          return { key, value: credential[key as keyof credentialSubject] || "N/A" };
        }
        return { key, value: "N/A" };
      });
    default:
      return Object.keys(credential)
        .filter((key) =>
            key !== "id" &&
            credential[key] !== null &&
            credential[key] !== undefined &&
            credential[key] !== ""
        )
        .map((key) => ({ key, value: credential[key] }));
  }
};

export const calculateUnverifiedClaims = (
  selectedClaims: claim[],
  verificationSubmissionResult: { vc: VCWrapper; vcStatus: string }[]
) => {
  return selectedClaims.filter((claim) =>
    verificationSubmissionResult.every(
      (vc) => vc.vc.credentialConfigurationId !== claim.type
    )
  );
};