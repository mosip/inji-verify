import { call, put, takeLatest } from "redux-saga/effects";
import { api } from "../../../utils/api";
import { ApiRequest } from "../../../types/data-types";
import { getRequestUri, setRequestUri } from "./verifyState";

function* fetchRequestUri() {
  let Data;
  const apiRequest: ApiRequest = api.fetchRequestUri;
  yield call(() =>
    fetch(apiRequest.url())
      .then((response) => response.text())
      .then((res) => {
        Data = res;
      })
      .catch((e) => {
        console.error("Failed to fetch request URI:", e);
      })
  );

  yield put(setRequestUri(Data));
}

function* verifySaga() {
  yield takeLatest(getRequestUri, fetchRequestUri);
}

export default verifySaga;
