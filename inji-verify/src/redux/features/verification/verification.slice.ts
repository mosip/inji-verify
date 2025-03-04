import { createSlice } from "@reduxjs/toolkit";
import { VerificationState } from "../../../types/data-types";
import { VerificationSteps } from "../../../utils/config";

export const PreloadedState: VerificationState = {
    alert: {},
    qrReadResult: { status: "NOT_READ" },
    method: "UPLOAD",
    activeScreen: VerificationSteps["UPLOAD"].QrCodePrompt,
    verificationResult: { vc: undefined, vcStatus: undefined },
    ovp: {}
};

const verificationSlice = createSlice({
    reducers: {
        selectMethod: (state, action) => {
            state.method = action.payload.method;
        },
        qrReadInit: (state, action) => {
            const method = action.payload.method;
            state.activeScreen = method === "SCAN" ? VerificationSteps[state.method].ActivateCamera : VerificationSteps[method].Verifying;
            state.method = method;
        },
        // qrReadComplete and init verification
        verificationInit: (state, action) => {
            state.activeScreen = VerificationSteps[state.method].Verifying;
            state.qrReadResult = action.payload.qrReadResult;
            state.ovp = action.payload;
        },
        verificationComplete: (state, action) => {
            state.activeScreen = VerificationSteps[state.method].DisplayResult;

            const isUserInfo = localStorage.getItem("userInfo");
            const userInfo = isUserInfo ? JSON.parse(window.atob(isUserInfo)) : "";

            if (action.payload && action.payload.verificationResult.vc.credentialSubject.email !== userInfo?.email) {
                state.verificationResult = {}
            }
            else {
                state.verificationResult = action.payload.verificationResult;
            }
        },
        goHomeScreen: (state, action) => {
            state.qrReadResult = { status: "NOT_READ" };
            state.activeScreen = VerificationSteps[state.method].QrCodePrompt;
            state.verificationResult = { vc: undefined, vcStatus: undefined };
            state.method = action.payload.method ?? state.method;
            state.ovp = {};
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
