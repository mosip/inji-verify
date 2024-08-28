export const extractRedirectUrlFromQrData = (qrData: string) => {
    // qr data format = OVP://payload:text-content
    const regex = /^INJI_OVP:\/\/payload=(.*)$/;
    const match = qrData.match(regex);
    return match ? match[1] : null;
}

export const initiateOvpFlow = (redirectUri: string) => {
    window.location.href = redirectUri;
}
