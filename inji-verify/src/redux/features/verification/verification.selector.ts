import {useAppSelector} from "../../hooks";
import {ApplicationState} from "../../../types/data-types";

export const useVerificationFlowSelector = (selector: (state: ApplicationState) => any) => selector(useAppSelector(state => state.verification));

export const useVerificationFlowActiveScreenSelector = () => useVerificationFlowSelector(state => state.activeScreen);
export const useVerificationFlowQrDataSelector = () => useVerificationFlowSelector(state => state.qrReadResult);
export const useVerificationFlowResultSelector = () => useVerificationFlowSelector(state => state.verificationResult);
export const useVerificationFlowTypeSelector = () => useVerificationFlowSelector(state => state.method);


