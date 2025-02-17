import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { api } from "../../../utils/api";
import { ApiRequest, claim, VCWrapper, VpRequestStatusApi, QrData, VcStatus } from "../../../types/data-types";
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
  apiRequest.body!.transactionId = `txn_${crypto.randomUUID()}`;
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
    const parsedData = JSON.parse(data) as QrData;
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

  yield put(setVpRequestResponse({ qrData: qrData, txnId: txnId, reqId: reqId }));
  return;
}

function* getVpStatus() {
  const txnId: string = yield select((state: RootState) => state.verify.txnId);
  const reqId: string = yield select((state: RootState) => state.verify.reqId);
  const apiRequest: VpRequestStatusApi = api.fetchStatus;
  const requestOptions = {
    method: apiRequest.methodType,
    headers: apiRequest.headers(),
  };

  const fetchStatus: any = function* () {
    try {
      const response: Response = yield call(fetch,apiRequest.url(reqId),requestOptions);
      if(response.status === 504){
        yield call(fetchStatus);
        return;
      }
      const data: string = yield response.text();
      const parsedData = JSON.parse(data);
      const status = parsedData.status;
      switch (status) {
        case "VP_SUBMITTED":
          yield put(setVpRequestStatus({ status, txnId, qrData: "" }));
          return;
        case "EXPIRED":
          yield put(raiseAlert({ ...AlertMessages().sessionExpired, open: true }));
          yield put(resetVpRequest());
          return;
        default:
          yield call(fetchStatus);
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
      const parsedData = JSON.parse(data);
      const vcResults: { vc: VCWrapper; vcStatus: VcStatus }[] = [];
      parsedData.vcresults.forEach(
        (vcResult: { vc: string; verificationStatus: VcStatus }) => {
          const verificationStatus = vcResult.verificationStatus;
          const vc: VCWrapper = JSON.parse(vcResult.vc);
          vcResults.push({
            vc: vc,
            vcStatus: verificationStatus,
          });
        }
      );
      yield put(verificationSubmissionComplete({verificationResult: [...vcResults]}));
      const isPartiallyShared:boolean = yield select((state: RootState) => state.verify.isPartiallyShared);
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
