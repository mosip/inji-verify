import { take, call, put } from 'redux-saga/effects';
import {ApplicationActions} from "./action";
import {extractVc} from "./utils";
import {ApplicationAction} from "../types/data-types";

function* verifyResult(action: ApplicationAction) {
    yield call(extractVc, action.payload.qrReadResult)
}
/*

function* verifySaga() {
    take(ApplicationActions.VERIFICATION_INIT, verifyResult)
}
*/
