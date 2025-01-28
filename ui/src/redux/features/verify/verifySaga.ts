import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { api } from "../../../utils/api";
import { ApiRequest, claim, CredentialVC, fetchStatusResponse, QrData, VcStatus } from "../../../types/data-types";
import {
  getVpRequest,
  resetVpRequest,
  setVpRequestResponse,
  setVpRequestStatus,
  verificationSubmissionComplete,
} from "./vpVerificationState";
import { AlertMessages, OPENID4VP_PROTOCOL } from "../../../utils/config";
import { raiseAlert } from "../alerts/alerts.slice";
import { getPresentationDefinition } from "../../../utils/commonUtils";
import { RootState } from "../../store";

function* fetchRequestUri(claims: claim[]) {
  let qrData;
  let txnId;
  let reqId;
  const apiRequest: ApiRequest = api.fetchVpRequest;
  const def = claims.flatMap((claim) => claim.definition.input_descriptors);
  apiRequest.body!.presentationDefinition.input_descriptors = [...def];
  apiRequest.body!.transactionId = `txn_${crypto.randomUUID()}`
  const requestOptions = {
    method: apiRequest.methodType,
    headers: apiRequest.headers(),
    body: JSON.stringify(apiRequest.body),
  };

  try {
    const response: Response = yield call(
      fetch,
      apiRequest.url(),
      requestOptions
    );
    const data: string = yield response.text();
    const parsedData = JSON.parse(data).response as QrData;
    const presentationDefinition = getPresentationDefinition(parsedData);
    qrData = OPENID4VP_PROTOCOL + btoa(presentationDefinition);
    txnId = parsedData.transactionId;
    reqId = parsedData.requestId;
  } catch (error) {
    console.error("Failed to fetch request URI:", error);
    yield put(resetVpRequest());
    yield put(
      raiseAlert({ ...AlertMessages().failToGenerateQrCode, open: true })
    );
    return;
  }

  yield put(
    setVpRequestResponse({ qrData: qrData, txnId: txnId, reqId: reqId })
  );
  return;
}

function* getVpStatus() {
  const txnId: string = yield select((state: RootState) => state.verify.txnId);
  const reqId: string = yield select((state: RootState) => state.verify.reqId);

  const apiRequest: ApiRequest = api.fetchStatus;
  const requestOptions = {
    method: apiRequest.methodType,
    headers: apiRequest.headers(),
  };

  const fetchStatus: any = function* () {
    try {
      let status;
      yield fetch(apiRequest.url(reqId), requestOptions)
        .then((res) => res.json() as unknown as fetchStatusResponse)
        .then((data) => (status = data.status));
      if (status === "VP_SUBMITTED") {
        yield put(setVpRequestStatus({ status, txnId, qrData: "" }));
        return;
      }
    } catch (error) {
      console.error("Error occurred:", error);
      yield put(resetVpRequest());
      yield put(raiseAlert({ ...AlertMessages().unexpectedError, open: true }));
      return;
    }
  };
  yield call(fetchStatus);
}

function* getVpResult() {
  const status: string = yield select((state: RootState) => state.verify.status);
  const txnId: string = yield select((state: RootState) => state.verify.txnId);

  if (status === "VP_SUBMITTED") {
    const apiRequest: ApiRequest = api.fetchVpResult;
    const requestOptions = {
      method: apiRequest.methodType,
      headers: apiRequest.headers(),
    };
    try {
      const response: Response = yield call(fetch, apiRequest.url(txnId), requestOptions);
      const data: string = yield response.text();
      const parsedData = JSON.parse(data).response;
      const vcResults: { vc: CredentialVC; vcStatus: VcStatus }[] = [];
      parsedData.vcresults.forEach(
        (vcResult: { vc: string; verificationStatus: VcStatus }) => {
          const verificationStatus = vcResult.verificationStatus;
          const vc: CredentialVC = JSON.parse(vcResult.vc);
          vcResults.push({
            vc: vc,
            vcStatus: verificationStatus,
          });
        }
      );
      yield put(verificationSubmissionComplete({verificationResult: [...vcResults]}));
      const unVerifiedClaims:[] = yield select((state: RootState) => state.verify.unVerifiedClaims);
      const isPartiallyShared = unVerifiedClaims.length > 0;
      if(isPartiallyShared){
        yield put(raiseAlert({ ...AlertMessages().partialCredentialShared, open: true }));
      }
      return;
    } catch (error) {
      console.error("Error occurred:", error);
      yield put(resetVpRequest());
      yield put(raiseAlert({ ...AlertMessages().validationFailure, open: true }));
      return;
    }
  }
}

function* verifySaga() {
  yield all([
    takeLatest(getVpRequest, function* ({ payload }) {
      yield call(fetchRequestUri, payload.selectedClaims);
    }),
    takeLatest(setVpRequestResponse, getVpStatus),
    takeLatest(setVpRequestStatus, getVpResult),
  ]);
}

export default verifySaga;
