import { createSlice } from "@reduxjs/toolkit";
import { insuranceCredentialPresentationDefinition, verifiableClaims, VerificationSteps } from "../../../utils/config";
import { VCShareType, VerifyState } from "../../../types/data-types";
import { calculateUnverifiedClaims } from "../../../utils/commonUtils";

const PreloadedState: VerifyState = {
  isLoading: false,
  status: "ACTIVE",
  qrData: "",
  txnId: "",
  reqId: "",
  method: "VERIFY",
  activeScreen: VerificationSteps["VERIFY"].InitiateVpRequest,
  SelectionPanel: false,
  verificationSubmissionResult: [],
  selectedClaims: verifiableClaims?.filter((claim) => claim.essential),
  unVerifiedClaims: [],
  sharingType: VCShareType.SINGLE,
  isPartiallyShared: false,
};

const vpVerificationState = createSlice({
  name: "vpVerification",
  initialState: PreloadedState,
  reducers: {
    setSharingType: (state, actions) => {
      state.sharingType = actions.payload.sharingType;
    },
    setSelectedClaims: (state, actions) => {
      state.selectedClaims = actions.payload.selectedClaims;
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      insuranceCredentialPresentationDefinition.input_descriptors = [...inputDescriptors];
      state.verificationSubmissionResult = [];
    },
    getVpRequest: (state, actions) => {
      state.SelectionPanel = false;
      state.activeScreen = VerificationSteps[state.method].ScanQrCode;
      const triggerElement = document.getElementById("OpenID4VPVerification_trigger");
      if (triggerElement) {
        const event = new MouseEvent("click", { bubbles: true, cancelable: true });
        triggerElement.dispatchEvent(event);
      }
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
    },
    setSelectCredential: (state) => {
      state.activeScreen = VerificationSteps[state.method].SelectCredential;
      state.selectedClaims = verifiableClaims.filter(
        (claim) => claim.essential
      );
      state.SelectionPanel = true;
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
    },
    setVpRequestResponse: (state, action) => {
      state.qrData = action.payload.qrData;
      state.txnId = action.payload.txnId;
      state.reqId = action.payload.reqId;
      state.isLoading = false;
      state.activeScreen = VerificationSteps[state.method].ScanQrCode;
      state.SelectionPanel = false;
    },
    setVpRequestStatus: (state, action) => {
      state.status = action.payload.status;
    },
    setVpRequest: (state, action) => {
      state.activeScreen = VerificationSteps[state.method].ScanQrCode;
    },
    verificationSubmissionComplete: (state, action) => {
      state.verificationSubmissionResult.push(...action.payload.verificationResult);
      state.unVerifiedClaims = calculateUnverifiedClaims(state.selectedClaims, state.verificationSubmissionResult);
      state.isPartiallyShared = state.unVerifiedClaims.length > 0 && state.sharingType === VCShareType.MULTIPLE;
      state.activeScreen = state.isPartiallyShared
        ? VerificationSteps[state.method].RequestMissingCredential
        : VerificationSteps[state.method].DisplayResult;
      state.txnId = "";
      state.qrData = "";
      state.reqId = "";
      state.status = "ACTIVE";
    },
    resetVpRequest: (state) => {
      state.activeScreen = VerificationSteps[state.method].InitiateVpRequest;
      state.verificationSubmissionResult = [];
      state.isLoading = false;
      state.activeScreen = VerificationSteps["VERIFY"].InitiateVpRequest;
      state.SelectionPanel = false;
      state.unVerifiedClaims = [];
      state.selectedClaims = [];
      state.txnId = "";
      state.qrData = "";
      state.reqId = "";
      state.status = "ACTIVE";
      state.sharingType = VCShareType.SINGLE;
      state.isPartiallyShared = false;
    },
  },
});

export const {
  getVpRequest,
  setSharingType,
  setSelectCredential,
  setVpRequestResponse,
  setVpRequestStatus,
  resetVpRequest,
  verificationSubmissionComplete,
  setSelectedClaims,
  setVpRequest
} = vpVerificationState.actions;

export default vpVerificationState.reducer;
