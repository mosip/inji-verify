import React from 'react';
import StepperContentHeader from "./StepperContentHeader";
import InjiStepper from "./InjiStepper";
import Navbar from "./Navbar";
import {VerificationProgressTrackerContainer} from "./styles";

function VerificationProgressTracker() {
    return (
        <VerificationProgressTrackerContainer id="inji-verify-progres-bar">
            <Navbar/>
            <StepperContentHeader/>
            <InjiStepper/>
        </VerificationProgressTrackerContainer>
    );
}

export default VerificationProgressTracker;


