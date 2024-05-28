import {createSlice} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../types/data-types";
import {VerificationSteps} from "../../../utils/config";

export const PreloadedState: ApplicationState = {
    alert: {},
    qrReadResult: {status: "NOT_READ"},
    method: "UPLOAD",
    activeScreen: VerificationSteps.ScanQrCodePrompt,
    verificationResult: {vc: undefined, vcStatus: undefined}
};

const verificationSlice = createSlice({
    reducers: {
        selectMethod: (state, action) => {
            state.method = action.payload.method;
        },
        qrReadInit: (state, action) => {
            const method = action.payload.method;
            state.activeScreen = method === "SCAN" ? VerificationSteps.ActivateCamera : VerificationSteps.Verifying;
            state.method = method;
        },
        // qrReadComplete and init verification
        verificationInit: (state, action) => {
            state.activeScreen = VerificationSteps.Verifying;
            state.qrReadResult = action.payload.qrReadResult;
        },
        verificationComplete: (state, action) => {
            state.activeScreen = VerificationSteps.DisplayResult;
            state.verificationResult = action.payload.verificationResult;
        },
        goHomeScreen: (state, action) => {
            state.qrReadResult = {status: "NOT_READ"};
            state.activeScreen = VerificationSteps.ScanQrCodePrompt;
            state.verificationResult = {vc: undefined, vcStatus: undefined};
        }
    },
    name: "VcVerification",
    initialState: PreloadedState
})

export const {
    qrReadInit, verificationInit,
    verificationComplete, goHomeScreen, selectMethod
} = verificationSlice.actions;

export default verificationSlice.reducer;
