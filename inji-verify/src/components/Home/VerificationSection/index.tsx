import React from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {VerificationSteps} from "../../../utils/config";
import {useAppSelector} from "../../../redux/hooks";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";

const DisplayActiveStep = () => {
    const {activeScreen} = useVerificationFlowSelector(state => ({activeScreen: state.activeScreen, qrData: state.qrReadResult?.qrData}));

    switch (activeScreen) {
        case VerificationSteps.ScanQrCodePrompt:
            return (<ScanQrCode/>);
        case VerificationSteps.ActivateCamera:
        case VerificationSteps.Verifying:
            return (<Verification/>);
        case VerificationSteps.DisplayResult:
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
