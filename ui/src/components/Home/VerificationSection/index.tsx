import React from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {VerificationSteps} from "../../../utils/config";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";

const DisplayActiveStep = () => {
    const {activeScreen, method} = useVerificationFlowSelector(state => ({activeScreen: state.activeScreen, qrData: state.qrReadResult?.qrData, method: state.method}));

    switch (activeScreen) {
        case VerificationSteps[method].QrCodePrompt:
            return (<ScanQrCode/>);
        case VerificationSteps[method].ActivateCamera:
        case VerificationSteps[method].Verifying:
            return (<Verification/>);
        case VerificationSteps[method].DisplayResult:
            return (<Result/>);
        default:
            return (<></>);
    }
}

const VerificationSection = () => {
    return (
        <div>
            <DisplayActiveStep/>
        </div>
    );
}

export default VerificationSection;
