import { call, put, takeLatest } from 'redux-saga/effects';
import {goHomeScreen, verificationComplete, verificationInit} from './verification.slice';
import {closeAlert, raiseAlert} from "../alerts/alerts.slice";
import {AlertMessages, OvpQrHeader} from '../../../utils/config';
import { decodeQrData } from '../../../utils/qr-utils'; // Assuming these functions are defined elsewhere
import {verify} from '../../../utils/verification-utils';
import {VcStatus} from "../../../types/data-types";
import {select} from "redux-saga-test-plan/matchers";
import {updateInternetConnectionStatus} from "../application-state/application-state.slice";
import {extractRedirectUrlFromQrData, initiateOvpFlow} from "../../../utils/ovp-utils";

function* handleVerification(data: string | object) {
    try {
        const dataType = typeof data;

        if (dataType === "string" && (data as string).startsWith(OvpQrHeader)) {
            yield call(handleOvpFlow, data as string);
            return;
        }
        const vc: object = typeof data === "object"
            ? (data as any).vpToken?.verifiableCredential[0] // ovp flow
            : yield call(JSON.parse, (decodeQrData(data))); // normal flow - vc in qr
        yield call(verifyVC, vc);
    } catch (error) {
        console.error(error)
        yield put(goHomeScreen({}));
        yield put(raiseAlert({...AlertMessages.qrNotSupported, open: true}));
    }
}

function* handleOvpFlow(qrData: string) {
    const redirectUrl = extractRedirectUrlFromQrData(qrData);
    if (redirectUrl) {
        initiateOvpFlow(redirectUrl);
    } else {
        console.error("Failed to extract the redirect url from the qr data");
        yield put(goHomeScreen({}));
        yield put(raiseAlert({...AlertMessages.qrNotSupported, open: true}));
    }
}

function* verifyVC(vc: any) {
    const onLine: boolean = yield select((state: any) => state.appState.internetConnectionStatus);
    try {
        const status: VcStatus = yield call(verify, vc);
        if (status?.checks?.length >= 0 && status?.checks[0].proof === "NOK" && !onLine) {
            yield put(updateInternetConnectionStatus({internetConnectionStatus: "OFFLINE"}));
        }
        yield put(verificationComplete({ verificationResult: { vc, vcStatus: status } }));
        yield put(closeAlert({}));
    } catch (error) {
        console.error("Error occurred while verifying the VC: ", error);
        if (!onLine) {
            yield put(updateInternetConnectionStatus({internetConnectionStatus: "OFFLINE"}));
            return;
        }
        yield put(verificationComplete({
            verificationResult: {
                vcStatus: {
                    status: "NOK",
                    checks: []
                },
                vc: null
            }
        }));
        yield put(closeAlert({}));
    }
}

function* verificationSaga() {
    yield takeLatest(verificationInit, function* ({ payload }) {
        yield call(handleVerification, payload.qrReadResult?.qrData ?? payload.ovp);
    });
}

export default verificationSaga;
export {handleVerification, verifyVC}
