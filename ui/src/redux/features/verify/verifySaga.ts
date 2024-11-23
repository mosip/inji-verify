import { call, put, takeLatest } from "redux-saga/effects";
import { api } from "../../../utils/api";
import { ApiRequest, QrData } from "../../../types/data-types";
import { getRequestUri, setRequestUri } from "./verifyState";

function* fetchRequestUri() {
  let qrData;
  const apiRequest: ApiRequest = api.fetchRequestUri;

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
        const pDef = JSON.stringify({"id":"c4822b58-7fb4-454e-b827-f8758fe27f9a","purpose":"Relying party is requesting your digital ID for the purpose of Self-Authentication","format":{"ldp_vc":{"proof_type":["RsaSignature2018"]}},"input_descriptors":[{"id":"id card credential","format":{"ldp_vc":{"proof_type":["Ed25519Signature2020"]}},"constraints":{"fields":[{"path":["$.credentialSubject.email"],"filter":{"type":"string","pattern":"@gmail.com"}}]}}]})
        qrData =
          `openid4vp://authorize?` +
          btoa(
            `client_id=${Data.authorizationDetails.clientId}&response_type=${Data.authorizationDetails.responseType}&response_mode=direct_post&nonce=${Data.authorizationDetails.nonce}&state=${Data.requestId}&response_uri=https://8065-2409-4073-2ebd-fe49-7d37-2889-9710-ad09.ngrok-free.app${Data.authorizationDetails.responseUri}&client_metadata={"name":"${window.location}"}&presentation_definition=${pDef}`
          );
          console.log("qrData :-", qrData);
          
      })
      .catch((e) => {
        console.error("Failed to fetch request URI:", e);
      })
  );

  yield put(setRequestUri(qrData));
}

function* verifySaga() {
  yield takeLatest(getRequestUri, fetchRequestUri);
}

export default verifySaga;
