import { createSlice } from "@reduxjs/toolkit";
import { verifiableClaims, VerificationSteps } from "../../../utils/config";
import { VCShareType, VerifyState } from "../../../types/data-types";
import { calculateUnverifiedClaims, calculateVerifiedClaims } from "../../../utils/commonUtils";

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
  presentationDefinition:{
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
      state.selectedClaims = verifiableClaims.filter((claim) => claim.essential );
      state.sharingType = state.selectedClaims.length > 1 ? VCShareType.MULTIPLE : VCShareType.SINGLE;
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      state.presentationDefinition.input_descriptors = [...inputDescriptors];
      state.SelectionPanel = true;
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
    },
    setSelectedClaims: (state, actions) => {
      state.selectedClaims = actions.payload.selectedClaims;
      state.sharingType = state.selectedClaims.length > 1 ? VCShareType.MULTIPLE : VCShareType.SINGLE;
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      state.presentationDefinition.input_descriptors = [...inputDescriptors];
      state.verificationSubmissionResult = [];
    },
    getVpRequest: (state, actions) => {
      state.selectedClaims = actions.payload.selectedClaims;
      state.sharingType = state.selectedClaims.length > 1 ? VCShareType.MULTIPLE : VCShareType.SINGLE;
      const inputDescriptors = state.selectedClaims.flatMap((claim) => claim.definition.input_descriptors);
      state.presentationDefinition.input_descriptors = [...inputDescriptors];
      state.SelectionPanel = false;
      state.activeScreen = VerificationSteps[state.method].ScanQrCode;
      state.verificationSubmissionResult = [];
      state.unVerifiedClaims = [];
    },
    verificationSubmissionComplete: (state, action) => {
      const verifiedVCs = calculateVerifiedClaims(state.selectedClaims, action.payload.verificationResult);
      state.verificationSubmissionResult.push(...verifiedVCs);
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
      state.presentationDefinition.input_descriptors = [];
    },
  },
});

export const {
  getVpRequest,
  setSelectCredential,
  resetVpRequest,
  verificationSubmissionComplete,
  setSelectedClaims,
} = vpVerificationState.actions;

export default vpVerificationState.reducer;
