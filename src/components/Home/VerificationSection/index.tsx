import React, {useEffect, useState} from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";

const DisplayActiveStep = ({activeStep, setActiveStep}: {
    activeStep: number, setActiveStep: (activeStep: number) => void
}) => {
    const [vc, setVc] = useState(null);
    const [vcStatus, setVcStatus] = useState(null);
    useEffect(() => {
        console.log({vc, vcStatus})
    }, [vc, vcStatus]);
    switch (activeStep) {
        case 0:
            return (<ScanQrCode setActiveStep={setActiveStep}/>);
        case 1:
        case 2:
            return (<Verification setActiveStep={setActiveStep} setVc={setVc} setVcStatus={setVcStatus}/>);
        case 3:
            return (<Result setActiveStep={setActiveStep} vc={vc} vcStatus={vcStatus}/>);
        default:
            return (<></>);
    }
}

const VerificationSection = ({activeStep, setActiveStep}: {
    activeStep: number,
    setActiveStep: (activeStep: number) => void
}) => {
    return (
        <div>
            <DisplayActiveStep activeStep={activeStep} setActiveStep={setActiveStep}/>
        </div>
    );
}

export default VerificationSection;
