import { decodeSdJwt } from "@sd-jwt/decode";
import { digest } from "@sd-jwt/crypto-browser";

const EXCLUDE_KEYS = [
  "cnf",
  "iss",
  "iat",
  "nbf",
  "exp",
  "jti",
  "sub",
  "ssn",
  "_sd_alg",
  "_sd",
  "@context",
  "issuer",
  "type",
].map((key) => key.toLowerCase());

export const decodeSdJwtToken = async (
  sdjwt: string
): Promise<{
  regularClaims: Record<string, any>;
  disclosedClaims: Record<string, any>;
}> => {
  const decodedSdJwt = await decodeSdJwt(sdjwt, digest);

  const disclosedClaims: Record<string, any> = {};

  for (const disclosure of decodedSdJwt.disclosures) {
    try {
      const key = (disclosure as any).key;
      const value = (disclosure as any).value;

      if (key && !EXCLUDE_KEYS.includes(String(key).toLowerCase())) {
        disclosedClaims[key] = value;
      }
    } catch (e) {
      console.warn("Failed to process disclosure:", disclosure, e);
    }
  }

  const regularClaims = Object.fromEntries(
    Object.entries(decodedSdJwt.jwt.payload).flatMap(([key, value]) => {
      if (EXCLUDE_KEYS.includes(key.toLowerCase()) || disclosedClaims[key]) {
        return [];
      }

      if (
        key === "credentialSubject" &&
        typeof value === "object" &&
        value !== null
      ) {
        return Object.entries(value).filter(
          ([subKey]) =>
            !EXCLUDE_KEYS.includes(subKey.toLowerCase()) &&
            !disclosedClaims[subKey]
        );
      }

      return [[key, value]];
    })
  );

  return { regularClaims, disclosedClaims };
};
