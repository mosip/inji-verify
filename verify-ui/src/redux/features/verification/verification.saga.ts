import { call, put, takeLatest } from 'redux-saga/effects';
import {goToHomeScreen, verificationComplete, verificationInit} from './verification.slice';
import {closeAlert, raiseAlert} from "../alerts/alerts.slice";
import {AlertMessages, BASE64_PADDING, OvpErrors, OvpQrHeader} from '../../../utils/config';
import { decodeQrData } from '../../../utils/qr-utils'; // Assuming these functions are defined elsewhere
import {verify} from '../../../utils/verification-utils';
import {VcStatus} from "../../../types/data-types";
import {select} from "redux-saga-test-plan/matchers";
import {updateInternetConnectionStatus} from "../application-state/application-state.slice";
import {extractRedirectUrlFromQrData, initiateOvpFlow} from "../../../utils/ovp-utils";
import {decode} from "@mosip/pixelpass";

function* handleVerification(data: any) {
    try {
        if (data?.vpToken) {
            yield call(verifyVC, data?.vpToken?.verifiableCredential[0]);
            return;
        }
        const stringData = new TextDecoder("utf-8").decode(data as Uint8Array);
        const responseStringData = stringData.startsWith(OvpQrHeader) ? stringData : decode(stringData);
        if ( responseStringData.startsWith(OvpQrHeader)) {
          yield call(handleOvpFlow, responseStringData);
          return;
        }
        const vc: object = yield call(JSON.parse, yield call(decodeQrData, data as Uint8Array));
        if(vc.toString().endsWith(BASE64_PADDING)){
            throw Error("Vc Type Not Supported")
        }
        yield call(verifyVC, vc);
    } catch (error) {
        console.error(error)
        yield put(goToHomeScreen({}));
        yield put(raiseAlert({...AlertMessages().qrNotSupported, open: true}));
    }
}

function* handleOvpFlow(qrData: string) {
    const redirectUrl = extractRedirectUrlFromQrData(qrData);
    if (redirectUrl) {
        initiateOvpFlow(redirectUrl);
    } else {
        console.error("Failed to extract the redirect url from the qr data");
        yield put(goToHomeScreen({}));
        yield put(raiseAlert({...AlertMessages().qrNotSupported, open: true}));
    }
}

function* verifyVC(vc: any) {
    const onLine: boolean = yield select((state: any) => state.appState.internetConnectionStatus);
    try {
        const status: VcStatus = yield call(verify, vc);
        yield put(verificationComplete({ verificationResult: { vc, vcStatus: status } }));
        yield put(closeAlert({}));
    } catch (error) {
        console.error("Error occurred while verifying the VC: ", error);
        if (!onLine) {
            yield put(updateInternetConnectionStatus({internetConnectionStatus: "OFFLINE"}));
            return;
        } else {
      yield put(goToHomeScreen({}));
      const OvpErrorMessages = OvpErrors();
      yield put(raiseAlert({ message: OvpErrorMessages.resource_not_found, severity: "error" }));
      return;
    }
  }
}

function* verificationSaga() {
    yield takeLatest(verificationInit, function* ({ payload }) {
        yield call(handleVerification, payload.qrReadResult?.qrData ?? payload.ovp);
    });
}

export default verificationSaga;
export {handleVerification, verifyVC}
