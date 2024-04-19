import {verify} from "../utils/verification-utils";
import {decodeQrData} from "../utils/qr-utils";
import {ApplicationState, QrReadResult} from "../types/data-types";

export const extractVc = async (qrReadResult: any) => {
    try {
        const decodedData =  decodeQrData(qrReadResult.qrData);
        return JSON.parse(decodedData);
    } catch (error) {
        // dispatch go home event and an alert
    }
}

export const verifyCredential = async () => {
    let result = await verify()
}