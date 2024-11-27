import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { api } from "../../../utils/api";
import { ApiRequest, QrData } from "../../../types/data-types";
import {
  getVpRequest,
  setVpRequestResponse,
  setVpRequestStatus,
  verificationSubmissionComplete,
} from "./verifyState";
import {
  OPENID4VP_PROTOCOL,
  PollStatusDelay,
  verifiableClaims,
} from "../../../utils/config";
import { v4 as uuidv4 } from "uuid";

function* fetchRequestUri(claims: string[]) {
  let qrData;
  let txnId;
  let reqId;
  const apiRequest: ApiRequest = api.fetchVpRequest;
  const selectedType = claims[0];
  const pdef = verifiableClaims.filter((claim) => {
    return claim.type === selectedType && claim.definition;
  })[0].definition;
  pdef["id"] = uuidv4();
  const requestOptions = {
    method: apiRequest.methodType,
    headers: apiRequest.headers(),
    body: apiRequest.body,
  };

  yield call(() =>
    fetch(apiRequest.url(), requestOptions)
      .then((response) => response.text())
      .then((res) => {
        const Data = JSON.parse(res) as QrData;
        qrData =
          OPENID4VP_PROTOCOL +
          btoa(
            `client_id=${Data.authorizationDetails.clientId}&response_type=${
              Data.authorizationDetails.responseType
            }&response_mode=direct_post&nonce=${
              Data.authorizationDetails.nonce
            }&state=${Data.requestId}&response_uri=${
              window._env_.VERIFY_SERVICE_API_URL +
              Data.authorizationDetails.responseUri
            }&presentation_definition_uri=${
              window._env_.VERIFY_SERVICE_API_URL +
              Data.authorizationDetails.presentationDefinitionUri
            }&client_metadata={"name":"${
              window.location
            }"}&presentation_definition=${JSON.stringify(pdef)}`
          );
        txnId = Data.transactionId;
        reqId = Data.requestId;
      })
      .catch((e) => {
        console.error("Failed to fetch request URI:", e);
      })
  );

  yield put(
    setVpRequestResponse({ qrData: qrData, txnId: txnId, reqId: reqId })
  );
}

function* getVpStatus(reqId: string, txnId: string) {
  const apiRequest: ApiRequest = api.fetchStatus;
  const requestOptions = {
    method: apiRequest.methodType,
    headers: apiRequest.headers(),
  };

  const pollStatus: any = function* () {
    try {
      const response: Response = yield call(
        fetch,
        apiRequest.url(reqId),
        requestOptions
      );
      const data: string = yield response.text();
      const parsedData = JSON.parse(data);
      const status = parsedData.status;
      if (status !== "PENDING") {
        yield put(setVpRequestStatus({ status, txnId, qrData: "" }));
        return;
      } else {
        yield delay(PollStatusDelay);
        yield call(pollStatus);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      return;
    }
  };

  yield call(pollStatus);
}

function* getVpResult(status: string, txnId: string) {
  if (status === "COMPLETED") {
    const apiRequest: ApiRequest = api.fetchVpResult;
    const requestOptions = {
      method: apiRequest.methodType,
      headers: apiRequest.headers(),
    };
    try {
      const response: Response = yield call(
        fetch,
        apiRequest.url(txnId),
        requestOptions
      );
      const data: string = yield response.text();
      const parsedData = JSON.parse(data);
      const verifiablePresentations = JSON.parse(
        parsedData.vpToken
      ).verifiableCredential;
      const verificationStatus = parsedData.verificationStatus;
      const vc1 = JSON.parse(verifiablePresentations[0]);
      yield put(
        verificationSubmissionComplete({
          verificationResult: {
            vc: vc1.verifiableCredential.credential,
            vcStatus: verificationStatus,
          },
        })
      );
      return;
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }
}

function* verifySaga() {
  yield all([
    takeLatest(getVpRequest, function* ({ payload }) {
      yield call(fetchRequestUri, payload.selectedClaims);
    }),
    takeLatest(setVpRequestResponse, function* ({ payload }) {
      yield call(getVpStatus, payload.reqId, payload.txnId);
    }),
    takeLatest(setVpRequestStatus, function* ({ payload }) {
      yield call(getVpResult, payload.status, payload.txnId);
    }),
  ]);
}

export default verifySaga;
