import {createSlice} from "@reduxjs/toolkit";
import {ApplicationState} from "../../types/data-types";
import {VerificationSteps} from "../../utils/config";

export const PreloadedState: ApplicationState = {
    alert: {},
    qrReadResult: {},
    flow: "TO_BE_SELECTED",
    activeScreen: VerificationSteps.ScanQrCodePrompt,
    verificationResult: {vc: undefined, vcStatus: undefined}
};

const verificationSlice = createSlice({
    reducers: {
        qrReadInit: (state, action) => {
            state.activeScreen = VerificationSteps.ActivateCamera;
            state.flow = action.payload.flow;
        },
        qrReadComplete: (state, action) => {
            state.activeScreen = action.payload.qrReadResult?.qrData ? VerificationSteps.ScanQrCodePrompt : VerificationSteps.Verifying;
            state.qrReadResult = action.payload.qrReadResult;
        },
        verificationInit: (state, action) => {
            state.activeScreen = VerificationSteps.Verifying;
        },
        verificationComplete: (state, action) => {
            state.activeScreen = VerificationSteps.DisplayResult;
            state.verificationResult = action.payload.verificationResult;
        },
        goHomeScreen: (state, action) => {
            state = PreloadedState;
        },
        raiseAlert: (state, action) => {
            state.alert = action.payload.alert;
        }
    },
    name: "VcVerification",
    initialState: PreloadedState
})

export const {
    qrReadInit, qrReadComplete, verificationInit,
    verificationComplete, raiseAlert, goHomeScreen
} = verificationSlice.actions;

export default verificationSlice.reducer;
