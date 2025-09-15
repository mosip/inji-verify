import {decodeSdJwtSync, getClaimsSync} from "@sd-jwt/decode";
import {HasherSync} from '@sd-jwt/types/src/type';
import {sha256} from "@noble/hashes/sha2";


export const decodeSdJwtToken = (sdjwt: string): Object => {
    const decodedSdJwt = decodeSdJwtSync(sdjwt, localHasher);

    return getClaimsSync(
        decodedSdJwt.jwt.payload,
        decodedSdJwt.disclosures,
        localHasher
    );
};

const localHasher: HasherSync = (data: string, alg: string): Uint8Array => new Uint8Array(sha256(new TextEncoder().encode(data)))
