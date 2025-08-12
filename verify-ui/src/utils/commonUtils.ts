import { claim, credentialSubject, VC, VcStatus } from "../types/data-types";
import { RenderOrders } from "./config";

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
      return RenderOrders.InsuranceCredentialRenderOrder.map((key:any) => {
        if (key in credential) {
          return {
            key,
            value: credential[key as keyof credentialSubject] || "N/A",
          };
        }
        return { key, value: "N/A" };
      });
    case "farmer":
      return RenderOrders.farmerLandCredentialRenderOrder.flatMap((key:any) => {
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
            return (farmOrder as string[]).map((farmField: any) => ({
              key: farmField,
              value: credential[farmKey][farmField] || "N/A",
            }));
          }
          return { key: farmKey, value: "N/A" };
        }
        return { key, value: "N/A" };
      });
    case "FarmerCredential":
      return RenderOrders.farmerCredentialRenderOrder.map((key:any) => {
        if (key in credential) {
          return { key, value: credential[key as keyof credentialSubject] || "N/A" };
        }
        return { key, value: "N/A" };
      });
    case "MOSIPVerifiableCredential":
    case "MockVerifiableCredential":
      return RenderOrders.MosipVerifiableCredentialRenderOrder.map((key: any) => {
        if (key in credential) {
          
          if(typeof(credential[key])=="object"){
            return { key, value: getValue(credential[key]) } ;
          }
          return { key, value: credential[key as keyof credentialSubject] || "N/A" };
        }
        return { key, value: "N/A" };
      });
    case "IncomeTaxAccountCredential":
      return RenderOrders.IncomeTaxAccountCredentialRenderOrder.map((key: any) => {
        if (key in credential) {
          return {
            key,
            value: credential[key as keyof credentialSubject] || "N/A",
          };
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
  verificationSubmissionResult: { vc: VC; vcStatus: VcStatus }[]
) => {
  return verificationSubmissionResult.filter((vc) =>
    selectedClaims.some((claim) => vc.vc.type.includes(claim.type))
  );
};

export const calculateUnverifiedClaims = (
  originalSelectedClaims: claim[],
  verificationSubmissionResult: { vc: VC; vcStatus: VcStatus }[]
): claim[] => {
  return originalSelectedClaims.filter((claim) => {
    return !verificationSubmissionResult.some((vcResult) => {
      const vcTypes = vcResult.vc?.type || [];
      return vcTypes.includes(claim.type);
    });
  });
};