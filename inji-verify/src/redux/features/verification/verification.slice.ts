import {createSlice} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../types/data-types";
import {VerificationSteps} from "../../../utils/config";

export const PreloadedState: ApplicationState = {
    alert: {},
    qrReadResult: {status: "NOT_READ"},
    flow: "TO_BE_SELECTED",
    activeScreen: VerificationSteps.ScanQrCodePrompt,
    verificationResult: {vc: undefined, vcStatus: undefined}
};

const verificationSlice = createSlice({
    reducers: {
        qrReadInit: (state, action) => {
            const flow = action.payload.flow;
            state.activeScreen = flow === "SCAN" ? VerificationSteps.ActivateCamera : VerificationSteps.Verifying;
            state.flow = flow;
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
            state.flow = "TO_BE_SELECTED";
            state.activeScreen = VerificationSteps.ScanQrCodePrompt;
            state.verificationResult = {vc: undefined, vcStatus: undefined};
        }
    },
    name: "VcVerification",
    initialState: PreloadedState
})

export const {
    qrReadInit, verificationInit,
    verificationComplete, goHomeScreen
} = verificationSlice.actions;

export default verificationSlice.reducer;
