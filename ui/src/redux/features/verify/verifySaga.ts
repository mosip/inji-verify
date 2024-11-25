import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { api } from "../../../utils/api";
import { ApiRequest, QrData } from "../../../types/data-types";
import {
  getVpRequest,
  setVpRequestResponse,
  setVpRequestStatus,
  verificationSubmissionComplete,
} from "./verifyState";
import { verificationComplete } from "../verification/verification.slice";

function* fetchRequestUri() {
  let qrData;
  let txnId;
  let reqId;
  const apiRequest: ApiRequest = api.fetchVpRequest;

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
        const pDef = JSON.stringify({
          id: "c4822b58-7fb4-454e-b827-f8758fe27f9a",
          purpose:
            "Relying party is requesting your digital ID for the purpose of Self-Authentication",
          format: { ldp_vc: { proof_type: ["RsaSignature2018"] } },
          input_descriptors: [
            {
              id: "id card credential",
              format: { ldp_vc: { proof_type: ["Ed25519Signature2020"] } },
              constraints: {
                fields: [
                  {
                    path: ["$.credentialSubject.email"],
                    filter: { type: "string", pattern: "@gmail.com" },
                  },
                ],
              },
            },
          ],
        });
        qrData =
          `openid4vp://authorize?` +
          btoa(
            `client_id=${Data.authorizationDetails.clientId}&response_type=${Data.authorizationDetails.responseType}&response_mode=direct_post&nonce=${Data.authorizationDetails.nonce}&state=${Data.requestId}&response_uri=https://3eda-117-242-205-81.ngrok-free.app${Data.authorizationDetails.responseUri}&client_metadata={"name":"${window.location}"}&presentation_definition=${pDef}`
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
  console.log(reqId);
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
      console.log(status);
      if (status !== "PENDING") {
        console.log("Polling stopped.");
        yield put(setVpRequestStatus({ status, txnId, qrData: "" }));
        return;
      } else {
        // Continue polling after 5 seconds
        yield delay(5000);
        yield call(pollStatus);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      console.log("Polling stopped.");
      return;
    }
  };

  yield call(pollStatus);
}

function* getVpResult(status: string, txnId: string) {
  console.log(status, txnId);
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
      const verificationStatus = parsedData.verificationStatus
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
  } else if (status === "FAILED") {
    yield put(
      verificationComplete({
        verificationResult: { vc: null, vcStatus: status },
      })
    );
  }
}

function* verifySaga() {
  yield all([
    takeLatest(getVpRequest, fetchRequestUri),
    takeLatest(setVpRequestResponse, function* ({ payload }) {
      yield call(getVpStatus, payload.reqId, payload.txnId);
    }),
    takeLatest(setVpRequestStatus, function* ({ payload }) {
      yield call(getVpResult, payload.status, payload.txnId);
    }),
  ]);
}

export default verifySaga;
