import { claim, credentialSubject, Detail, VC, VpSubmissionResultInt } from "../types/data-types";
import { desiredOrder } from "./config";

export const getPresentationDefinition = (data: any) => {
  return (
    `client_id=${data.authorizationDetails.clientId}` +
    `&response_type=${data.authorizationDetails.responseType}` +
    `&response_mode=direct_post` +
    `&nonce=${data.authorizationDetails.nonce}` +
    `&state=${data.requestId}` +
    `&response_uri=${window._env_.VERIFY_SERVICE_API_URL + data.authorizationDetails.responseUri}` +
    `${data.authorizationDetails.presentationDefinitionUri ? 
      `&presentation_definition_uri=${window._env_.VERIFY_SERVICE_API_URL + data.authorizationDetails.presentationDefinitionUri}` : 
      `&presentation_definition=${JSON.stringify(data.authorizationDetails.presentationDefinition)}`}` +
    `&client_metadata={"client_name":"${window.location.origin}"}`
  );
};

export const getDetailsOrder = (vc: credentialSubject): Detail[] => {
  return desiredOrder.map((key) => {
    if (key in vc) {
      return { key, value: vc[key as keyof credentialSubject] || "N/A" };
    }
    return { key, value: "N/A" };
  });
};


export const calculateUnverifiedClaims = (
  selectedClaims: claim[],
  verificationSubmissionResult: { vc: VC; vcStatus: string }[]
) => {
  if (selectedClaims.length > 1) return [];
  return selectedClaims.filter((claim) =>
    verificationSubmissionResult.some(
      (vc) => vc.vc.credentialConfigurationId !== claim.type
    )
  );
};