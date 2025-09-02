import { decodeSdJwt, getClaims } from "@sd-jwt/decode";
import { digest } from "@sd-jwt/crypto-browser";

export const decodeSdJwtToken = async (sdjwt: string): Promise<Object> => {
  const decodedSdJwt = await decodeSdJwt(sdjwt, digest);

  const claims:Object = await getClaims(
    decodedSdJwt.jwt.payload,
    decodedSdJwt.disclosures,
    digest
  );
  return claims;
};
