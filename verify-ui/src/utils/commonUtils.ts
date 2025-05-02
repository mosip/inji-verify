import { claim, credentialSubject, VCWrapper, QrData, VcStatus } from "../types/data-types";
import { InsuranceCredentialRenderOrder, farmerLandCredentialRenderOrder, farmerCredentialRenderOrder, MosipVerifiableCredentialRenderOrder } from "./config";

export const getPresentationDefinition = (data: QrData) => {
  const params = new URLSearchParams();
  params.set("client_id", data.authorizationDetails.clientId);
  params.set("response_type", data.authorizationDetails.responseType);
  params.set("response_mode", "direct_post");
  params.set("nonce", data.authorizationDetails.nonce);
  params.set("state", data.requestId);
  params.set(
    "response_uri",
    window.location.origin + window._env_.VERIFY_SERVICE_API_URL + data.authorizationDetails.responseUri
  );
  if (data.authorizationDetails.presentationDefinitionUri) {
    params.set(
      "presentation_definition_uri",
      window.location.origin + window._env_.VERIFY_SERVICE_API_URL + data.authorizationDetails.presentationDefinitionUri
    );
  } else {
    params.set(
      "presentation_definition",
      JSON.stringify(data.authorizationDetails.presentationDefinition)
    );
  }
  params.set(
    "client_metadata",
    JSON.stringify({ client_name: window.location.origin, vp_formats: {} })
  );
  return params.toString();
};

const getValue = (credentialElement: any)=> {
  if (Array.isArray(credentialElement)){
    return credentialElement.filter(element => element.language === "eng")[0].value
  }
  return credentialElement.value;
}

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
            return { key, value: getValue(credential[key]) } ;
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

export const calculateVerifiedClaims = (
  selectedClaims: claim[],
  verificationSubmissionResult: { vc: VCWrapper; vcStatus: VcStatus }[]
) => {
  return verificationSubmissionResult.filter((vc) =>
    selectedClaims.some((claim) => claim.type.toLowerCase() === vc.vc.credentialConfigurationId.toLowerCase())
  );
};

export const calculateUnverifiedClaims = (
  selectedClaims: claim[],
  verificationSubmissionResult: { vc: VCWrapper; vcStatus: VcStatus }[]
) => {
  return selectedClaims.filter((claim) =>
    !verificationSubmissionResult.some(
      (vc) => vc.vc.credentialConfigurationId.toLowerCase() === claim.type.toLowerCase()
    )
  );
};
