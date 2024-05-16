import {getResolver} from 'web-did-resolver';
import {Resolver} from 'did-resolver';
import {SUPPORTED_DID_METHODS} from "./config";

const getDIDMethod = (did: string) => {
    const regex = /^did:([^:]+):/;
    const match = did?.match(regex);
    return match ? match[1] : "";
}

export const resolveDid = async (did: string)  => {
    const didMethod = getDIDMethod(did);
    if (SUPPORTED_DID_METHODS.indexOf(didMethod) === -1)
        throw new Error(`Unsupported DID method: ${didMethod}. DID: ${did}`);
    const webResolver = getResolver();
    let didResolver = new Resolver({
        ...webResolver
    });

    return await didResolver.resolve(did);
}

export const constructWellKnownUrlFromDid = (issuerId: string) => {
    // Define a regular expression to extract the URL
    const regex = /did:web:([^:]+:[^#]+)/;
    const match = issuerId?.match(regex);
    // Extract the URL from the matched groups
    return match ? `https://${match[1].replaceAll(":", "/")}/.wellknown/openid-credential-issuer` : null;
}

