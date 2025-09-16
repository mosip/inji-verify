import { decodeSdJwt } from "@sd-jwt/decode";
import { digest } from "@sd-jwt/crypto-browser";

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

      if (key) {
        disclosedClaims[key] = value;
      }
    } catch (e) {
      console.warn("Failed to process disclosure:", disclosure, e);
    }
  }

  const regularClaims = Object.fromEntries(
    Object.entries(decodedSdJwt.jwt.payload).flatMap(([key, value]) => {
      if (disclosedClaims[key]) {
        return [];
      }

      if (
        key === "credentialSubject" &&
        typeof value === "object" &&
        value !== null
      ) {
        return Object.entries(value).filter(
          ([subKey]) => !disclosedClaims[subKey]
        );
      }

      return [[key, value]];
    })
  );

  return { regularClaims, disclosedClaims };
};
