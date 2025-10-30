import {claim, LdpVc, VcStatus} from "../types/data-types";
import {EXCLUDE_KEYS_SD_JWT_VC, getVCRenderOrders} from "./config";
import i18next from "i18next";

const getValue = (credentialElement: any, language: string): string | undefined => {
    const lang = i18next.language || "en";
    if (credentialElement === null || credentialElement === undefined) {
        return undefined;
    }

    if (typeof credentialElement === "boolean") {
        return credentialElement ? "true" : "false";
    }

    if (Array.isArray(credentialElement)) {
        const langEntry = credentialElement.find((el) => el?.["@language"] === lang || el?.language === lang);
        if (langEntry) {
            return langEntry["@value"] ?? langEntry.value;
        }

        const fallbackEntry = credentialElement.find(
            (el) => el?.["@language"] === "en" || el?.language === "en"
        );
        if (fallbackEntry) {
            return fallbackEntry["@value"] ?? fallbackEntry.value;
        }
    }
    if (typeof credentialElement === "object") {
        if ("value" in credentialElement) {
            return getValue(credentialElement.value, lang);
        }
        for (const key of Object.keys(credentialElement)) {
            const nestedValue = getValue(key, lang);
            if (nestedValue !== undefined) return nestedValue;
        }
    }
    return String(credentialElement);
};

export const getDetailsOrder = (vc: any, language: string) => {
    const lang = i18next.language || "en";
    if (!vc || (typeof vc === "object" && Object.keys(vc).length === 0)) {
        return [];
    }

    const credential =
        vc?.regularClaims && vc?.disclosedClaims
            ? {...vc.regularClaims, ...vc.disclosedClaims}
            : vc?.credentialSubject ?? vc;

    const type = vc?.regularClaims && vc?.disclosedClaims ? "SdJwtVC" : vc?.type?.[1];

    switch (type) {
        case "InsuranceCredential":
        case "LifeInsuranceCredential":
            return getVCRenderOrders().InsuranceCredentialRenderOrder.map((key: any) => {
                if (key in credential) {
                    return {
                        key,
                        value: getValue(credential[key], lang) || "N/A",
                    };
                }
                return {key, value: "N/A"};
            });
        case "farmer":
            return getVCRenderOrders().farmerLandCredentialRenderOrder.flatMap((key: any) => {
                if (typeof key === "string") {
                    return {
                        key,
                        value: getValue(credential[key], lang) || "N/A",
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
                    return {key: farmKey, value: "N/A"};
                }
                return {key, value: "N/A"};
            });
        case "FarmerCredential":
            return getVCRenderOrders().farmerCredentialRenderOrder.map((key: any) => {
                if (key in credential) {
                    return {key, value: getValue(credential[key], lang) || "N/A"};
                }
                return {key, value: "N/A"};
            });
        case "MOSIPVerifiableCredential":
        case "MockVerifiableCredential":
            return getVCRenderOrders().MosipVerifiableCredentialRenderOrder.map((key: any) => {
                if (key in credential) {

                    if (typeof (credential[key]) == "object") {
                        return {key, value: getValue(credential[key], lang)};
                    }
                    return {key, value: getValue(credential[key], lang) || "N/A"};
                }
                return {key, value: "N/A"};
            });
        case "IncomeTaxAccountCredential":
            return getVCRenderOrders().IncomeTaxAccountCredentialRenderOrder.map(
                (key: any) => {
                    if (key in credential) {
                        return {
                            key,
                            value: getValue(credential[key], lang) || "N/A",
                        };
                    }
                    return {key, value: "N/A"};
                }
            );
        case "SdJwtVC":
            return Object.keys(credential)
                .filter(
                    (key) =>
                        key !== "id" &&
                        credential[key] !== null &&
                        credential[key] !== undefined &&
                        credential[key] !== "" &&
                        !EXCLUDE_KEYS_SD_JWT_VC.includes(key.toLowerCase())
                )
                .map((key) => ({key, value: getValue(credential[key], lang)}));
        default:
            return Object.keys(credential)
                .filter((key) =>
                    key !== "id" &&
                    credential[key] !== null &&
                    credential[key] !== undefined &&
                    credential[key] !== ""
                )
                .map((key) => ({key, value: getValue(credential[key], lang)}));
    }
};

export const calculateVerifiedClaims = (
    selectedClaims: claim[],
    verificationSubmissionResult: { vc: LdpVc | object; vcStatus: VcStatus }[]
) => {
    return verificationSubmissionResult.filter((vc) =>
        selectedClaims.some((claim) => getCredentialType(vc.vc) === claim.type)
    );
};

export const calculateUnverifiedClaims = (
    originalSelectedClaims: claim[],
    verificationSubmissionResult: { vc: LdpVc | object; vcStatus: VcStatus }[]
): claim[] => {
    return originalSelectedClaims.filter((claim) => {
        return !verificationSubmissionResult.some(
            (vcResult) => getCredentialType(vcResult.vc) === claim.type
        );
    });
};

const extractType = (type: any): string | undefined => {
    if (!type) return undefined;
    if (typeof type === "string")
        return type !== "VerifiableCredential" ? type : undefined;
    if (typeof type === "object" && "_value" in type) {
        return type._value !== "VerifiableCredential" ? type._value : undefined;
    }
    return String(type);
};

export const getCredentialType = (credential: any): string => {
    const sdType = credential?.regularClaims?.type || credential?.regularClaims?.vct;
    if (sdType) {
        if (Array.isArray(sdType)) {
            for (const type of sdType) {
                const credentialType = extractType(type);
                if (credentialType) return credentialType;
            }
        } else {
            const credentialType = extractType(sdType);
            if (credentialType) return credentialType;
        }
    }

    if (Array.isArray(credential?.type)) {
        for (const type of credential.type) {
            const credentialType = extractType(type);
            if (credentialType) return credentialType;
        }
    }

    return "verifiableCredential";
};