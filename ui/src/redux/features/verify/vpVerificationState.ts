import { createSlice } from "@reduxjs/toolkit";
import { VerificationSteps } from "../../../utils/config";
import { VerifyState } from "../../../types/data-types";

const PreloadedState: VerifyState = {
  isLoading: false,
  status: "PENDING",
  qrData: "",
  txnId: "",
  reqId: "",
  method: "VERIFY",
  activeScreen: VerificationSteps["VERIFY"].InitiateVpRequest,
  SelectionPannel: false,
  verificationSubmissionResult: [],
  selectedClaims: [],
  unVerifiedClaims: [],
};

const vpVerificationState = createSlice({
  name: "vpVerification",
  initialState: PreloadedState,
  reducers: {
    getVpRequest: (state, actions) => {
      state.isLoading = true;
      state.selectedClaims = actions.payload.selectedClaims;
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
    },
    setSelectCredential: (state) => {
      state.activeScreen = VerificationSteps[state.method].SelectCredential;
      state.SelectionPannel = true;
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
    },
    setVpRequestResponse: (state, action) => {
      state.qrData = action.payload.qrData;
      state.txnId = action.payload.txnId;
      state.reqId = action.payload.reqId;
      state.isLoading = false;
      state.activeScreen = VerificationSteps[state.method].ScanQrCode;
      state.SelectionPannel = false;
    },
    setVpRequestStatus: (state, action) => {
      state.status = action.payload.status;
      state.txnId = action.payload.txnId;
      state.reqId = action.payload.reqId;
    },
    verificationSubmissionComplete: (state, action) => {
      state.verificationSubmissionResult.push(
        ...action.payload.verificationResult
      );
      state.unVerifiedClaims = state.selectedClaims.filter((claim) =>
        state.verificationSubmissionResult.some(
          (vc) =>
            vc.vc.verifiableCredential.credentialConfigurationId !== claim.type
        )
      );
      const isPartiallyShared = state.unVerifiedClaims.length > 0;
      state.activeScreen = isPartiallyShared
        ? VerificationSteps[state.method].RequestMissingCredential
        : VerificationSteps[state.method].DisplayResult;
      state.txnId = "";
      state.qrData = "";
      state.reqId = "";
      state.status = "PENDING";
    },
    resetVpRequest: (state) => {
      state.activeScreen = VerificationSteps[state.method].InitiateVpRequest;
      state.verificationSubmissionResult = [];
      state.isLoading = false;
      state.activeScreen = VerificationSteps["VERIFY"].InitiateVpRequest;
      state.SelectionPannel = false;
      state.unVerifiedClaims = [];
      state.txnId = "";
      state.qrData = "";
      state.reqId = "";
      state.status = "PENDING";
    },
  },
});

export const {
  getVpRequest,
  setSelectCredential,
  setVpRequestResponse,
  setVpRequestStatus,
  resetVpRequest,
  verificationSubmissionComplete,
} = vpVerificationState.actions;

export default vpVerificationState.reducer;
