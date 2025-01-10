import { createSlice } from "@reduxjs/toolkit";
import { VerificationSteps } from "../../../utils/config";

const PreloadedState = {
  isLoading: false,
  status: "PENDING",
  qrData: "",
  txnId: "",
  reqId: "",
  method: "VERIFY",
  activeScreen: VerificationSteps["VERIFY"].InitiateVpRequest,
  SelectionPannel: false,
  verificationSubmissionResult: { vc: undefined, vcStatus: undefined },
};

const verifyState = createSlice({
  name: "vpVerification",
  initialState: PreloadedState,
  reducers: {
    getVpRequest: (state, actions) => {
      state.isLoading = true;
    },
    setSelectCredential: (state) => {
      state.activeScreen = VerificationSteps[state.method].SelectCredential;
      state.SelectionPannel = true;
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
      state.verificationSubmissionResult = action.payload.verificationResult;
      state.activeScreen = VerificationSteps[state.method].DisplayResult;
    },
    resetVpRequest: (state) => {
      state.activeScreen = VerificationSteps[state.method].InitiateVpRequest;
      state.verificationSubmissionResult = {
        vc: undefined,
        vcStatus: undefined,
      };
      state.isLoading = false;
      state.status = "PENDING";
      state.qrData = "";
      state.txnId = "";
      state.reqId = "";
      state.activeScreen = VerificationSteps["VERIFY"].InitiateVpRequest;
      state.verificationSubmissionResult = {
        vc: undefined,
        vcStatus: undefined,
      };
      state.SelectionPannel = false;
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
} = verifyState.actions;

export default verifyState.reducer;
