import React from 'react';
import StepperContentHeader from "./StepperContentHeader";
import InjiStepper from "./InjiStepper";
import Navbar from "./Navbar";
import {VerificationProgressTrackerContainer} from "./styles";

function VerificationProgressTracker({activeStep}: {activeStep: number}) {
    return (
        <VerificationProgressTrackerContainer>
            <Navbar/>
            <StepperContentHeader/>
            <InjiStepper activeStep={activeStep}/>
        </VerificationProgressTrackerContainer>
    );
}

export default VerificationProgressTracker;
