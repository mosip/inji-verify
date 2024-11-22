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
        qrData = `openid4vp://?client_id=${
          Data.authorizationDetails.clientId
        }&presentation_definition=${window.encodeURIComponent(
          Data.authorizationDetails.presentationDefinitionUri
        )}&response_type=${
          Data.authorizationDetails.responseType
        }&response_mode=direct_post&nonce=${
          Data.authorizationDetails.nonce
        }&state=${Data.requestId}&response_uri=${window.encodeURIComponent(
          Data.authorizationDetails.responseUri
        )}`;
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
