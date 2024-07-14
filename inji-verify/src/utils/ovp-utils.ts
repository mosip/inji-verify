export const extractRedirectUrlFromQrData = (qrData: string) => {
    // qr data format = OVP://payload:text-content
    const regex = /^INJI_OVP:\/\/payload=(.*)$/;
    const match = qrData.match(regex);
    return match ? match[1] : null;
}

export const initiateOvpFlow = (redirectUri: string) => {
    console.log("Initiating the OVP Flow...");
    fetch(redirectUri, {
        method: "GET",
        redirect: "follow"
    })
        .then(response => {
            console.log("OVP Flow initiated successfully");
        })
        .catch(error => {
            console.error("Error occurred while initiating the ovp flow: ", error);
        });
}
