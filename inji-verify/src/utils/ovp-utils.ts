import {OvpClientId} from "./config";

export const extractRedirectUrlFromQrData = (qrData: string) => {
    // qr data format = OVP://payload:text-content
    const regex = /^INJI_OVP:\/\/payload=(.*)$/;
    const match = qrData.match(regex);
    return match ? match[1] : null;
}

export const initiateOvpFlow = (redirectUri: string) => {
    console.log("Initiating OVP Flow...");
    window.location.href = `${redirectUri}&client_id=${OvpClientId}&redirect_uri=${window.location.origin}/redirect`;
}
