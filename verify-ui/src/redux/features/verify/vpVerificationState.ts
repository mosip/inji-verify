import { createSlice } from "@reduxjs/toolkit";
import { getVerifiableClaims, VerificationSteps } from "../../../utils/config";
import { VCShareType, VerifyState } from "../../../types/data-types";
import { calculateUnverifiedClaims, calculateVerifiedClaims } from "../../../utils/commonUtils";

const PreloadedState: VerifyState = {
  isLoading: false,
  status: "ACTIVE",
  flowType: "crossDevice",
  qrData: "",
  txnId: "",
  reqId: "",
  method: "VERIFY",
  activeScreen: VerificationSteps["VERIFY"].InitiateVpRequest,
  SelectionPanel: false,
  verificationSubmissionResult: [],
  selectedClaims: getVerifiableClaims()?.filter((claim) => claim.essential),
  originalSelectedClaims: getVerifiableClaims()?.filter((claim) => claim.essential),
  unVerifiedClaims: [],
  sharingType: VCShareType.SINGLE,
  isPartiallyShared: false,
  isShowResult: false,
  presentationDefinition: {
    id: "c4822b58-7fb4-454e-b827-f8758fe27f9a",
    purpose:
      "Relying party is requesting your digital ID for the purpose of Self-Authentication",
    format: {
      ldp_vc: {
        proof_type: ["Ed25519Signature2020"],
      },
    },
    input_descriptors: [] as any[],
  }  
};

const vpVerificationState = createSlice({
  name: "vpVerification",
  initialState: PreloadedState,
  reducers: {
    setSelectCredential: (state) => {
      state.activeScreen = VerificationSteps[state.method].SelectCredential;
      state.selectedClaims = getVerifiableClaims().filter((claim) => claim.essential );
      state.originalSelectedClaims = [...state.selectedClaims];
      state.sharingType = state.selectedClaims.length > 1 ? VCShareType.MULTIPLE : VCShareType.SINGLE;
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      state.presentationDefinition.input_descriptors = [...inputDescriptors];
      state.SelectionPanel = true;
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
      state.isShowResult = false;
    },
    setSelectedClaims: (state, actions) => {
      state.selectedClaims = actions.payload.selectedClaims;
      state.sharingType = state.selectedClaims.length > 1 ? VCShareType.MULTIPLE : VCShareType.SINGLE;
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      state.presentationDefinition.input_descriptors = [...inputDescriptors];
      state.verificationSubmissionResult = [];
      state.originalSelectedClaims = [...state.selectedClaims];
    },
    setFlowType:(state)=>{
      state.SelectionPanel = false;
      state.flowType = "sameDevice";
      state.activeScreen = VerificationSteps[state.method].SelectWallet;
    },
    getVpRequest: (state, actions) => {
      if (state.isPartiallyShared && state.unVerifiedClaims.length > 0) {
        state.selectedClaims = state.unVerifiedClaims;
      } else {
        state.selectedClaims = actions.payload.selectedClaims;
        state.originalSelectedClaims = actions.payload.selectedClaims;
      }
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      state.presentationDefinition.input_descriptors = [...inputDescriptors];
      state.SelectionPanel = false;
      state.isShowResult = false;
      state.activeScreen = VerificationSteps[state.method].ScanQrCode;
      state.unVerifiedClaims = [];
    },
    verificationSubmissionComplete: (state, action) => {
      const newlyVerified = calculateVerifiedClaims(state.selectedClaims, action.payload.verificationResult);

      const uniqueResult = [
        ...state.verificationSubmissionResult,
        ...newlyVerified.filter(
          (vc) =>
            !state.verificationSubmissionResult.some(
              (existing) => existing.vc.type[1] === vc.vc.type[1]
            )
        ),
      ];
      state.verificationSubmissionResult = uniqueResult;
      state.isShowResult = true;
      state.unVerifiedClaims = calculateUnverifiedClaims(state.originalSelectedClaims, state.verificationSubmissionResult);
      state.isPartiallyShared = state.unVerifiedClaims.length > 0;
      state.activeScreen = state.isPartiallyShared
        ? VerificationSteps[state.method].RequestMissingCredential
        : VerificationSteps[state.method].DisplayResult;
      state.flowType = state.isPartiallyShared && state.flowType === "sameDevice" ? "sameDevice" : "crossDevice";
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
      state.flowType = "crossDevice";
      state.sharingType = VCShareType.SINGLE;
      state.isPartiallyShared = false;
      state.isShowResult = false;
      state.presentationDefinition.input_descriptors = [];
    },
  },
});

export const {
  getVpRequest,
  setSelectCredential,
  setFlowType,
  resetVpRequest,
  verificationSubmissionComplete,
  setSelectedClaims,
} = vpVerificationState.actions;

export default vpVerificationState.reducer;
