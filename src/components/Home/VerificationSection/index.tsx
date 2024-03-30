import React from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";

const getActiveStep = (activeStep: number) => {
    switch (activeStep) {
        case 0:
            return <ScanQrCode />;
        case 1:
        case 2:
            return <Verification />;  // Handle cases 1 and 2 with the same component
        case 3:
            return <Result />;
        default:
            return null; // Or return any default component/message
    }
}

const VerificationSection = ({activeStep}: {activeStep: number}) => {
    return (
        <div>
            {getActiveStep(activeStep)}
        </div>
    );
}

export default VerificationSection;
