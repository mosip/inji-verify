import {useAppSelector} from "../../hooks";
import {VerificationState, VerifyState} from "../../../types/data-types";

export const useVerificationFlowSelector = (selector: (state: VerificationState) => any) => selector(useAppSelector(state => state.verification));
export const useVerifyFlowSelector = (selector: (state: VerifyState) => any) => selector(useAppSelector(state => state.verify));

export const useVerificationFlowActiveScreenSelector = () => useVerificationFlowSelector(state => state.activeScreen);
export const useVerificationFlowQrDataSelector = () => useVerificationFlowSelector(state => state.qrReadResult);
export const useVerificationFlowResultSelector = () => useVerificationFlowSelector(state => state.verificationResult);
export const useVerificationFlowTypeSelector = () => useVerificationFlowSelector(state => state.method);


