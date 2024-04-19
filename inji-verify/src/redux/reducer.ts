import { combineReducers } from 'redux';
import { ApplicationActions } from './action';
import {ApplicationAction, ApplicationState} from "../types/data-types";
import {VerificationSteps} from "../utils/config";

export const PreloadedState: ApplicationState = {
    alert: {},
    qrReadResult: {},
    flow: "TO_BE_SELECTED",
    activeScreen: VerificationSteps.ScanQrCodePrompt
};

const stateReducer = (state = PreloadedState, action: ApplicationAction) => {
    switch (action.type) {
        case ApplicationActions.TRIGGER_QR_READ:
            return {
                ...state,
                activeScreen: VerificationSteps.ActivateCamera,
                flow: action.payload.flow
            };
        case ApplicationActions.QR_READ_COMPLETE:
            return {
                ...state,
                activeScreen: action.payload.qrReadResult?.qrData ? VerificationSteps.ScanQrCodePrompt : VerificationSteps.Verifying,
                qrReadResult: action.payload.qrReadResult
            };
        case ApplicationActions.VERIFICATION_INIT:
            return {
                ...state,
                activeScreen: VerificationSteps.Verifying
            };
        case ApplicationActions.VERIFICATION_COMPLETE:
            return {
                ...state,
                activeScreen: VerificationSteps.Verifying,
                verificationResult: action.payload.verificationResult
            };
        case ApplicationActions.GO_HOME_SCREEN:
            return PreloadedState;
        case ApplicationActions.RAISE_ALERT:
            return {
                ...state,
                alert: action.payload.alert
            };
        default:
            return state;
    }
};

export const rootReducer = combineReducers({
    state: stateReducer
});
