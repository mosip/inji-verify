import {verifyCredential/*, downloadRevocationList*/} from 'verification-sdk';
import {SAMPLE_DID, SAMPLE_VERIFIABLE_CREDENTIAL} from "./samples";

export const verify = async (vc) => {
    // download revocation list
    // resolve did
    let status = await verifyCredential(SAMPLE_DID,  SAMPLE_VERIFIABLE_CREDENTIAL, []);
    console.log("VC Status: ", status);
    return status;
}
