import { call, put, takeLatest } from 'redux-saga/effects';
import {goHomeScreen, verificationComplete, verificationInit} from './verification.slice';
import {closeAlert, raiseAlert} from "../alerts/alerts.slice";
import { AlertMessages } from '../../../utils/config';
import { decodeQrData } from '../../../utils/qr-utils'; // Assuming these functions are defined elsewhere
import {verify} from '../../../utils/verification-utils';
import {VcStatus} from "../../../types/data-types";

function* handleVerification(qrData: string) {
    try {
        const vc: object = yield call(JSON.parse, (decodeQrData(qrData)));
        yield call(verifyVC, vc);
    } catch (error) {
        yield put(goHomeScreen({}));
        yield put(raiseAlert({...AlertMessages.qrNotSupported, open: true}));
    }
}

function* verifyVC(vc: any) {
    try {
        const status: VcStatus = yield call(verify, vc);
        console.log("VC Status [logging in saga]: ", status);
        if (status?.checks?.length >= 0 && status?.checks[0].proof === "NOK" && !window.navigator.onLine) {
            yield call(window.location.assign, '/offline');
        }
        yield put(verificationComplete({ verificationResult: { vc, vcStatus: status } }));
        yield put(closeAlert({}));
    } catch (error) {
        console.error("Error occurred while verifying the VC: ", error);
        if (!window.navigator.onLine) {
            yield call(window.location.assign, '/offline');
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
        yield call(handleVerification, payload.qrReadResult?.qrData);
    });
}

export default verificationSaga;
export {handleVerification, verifyVC}
