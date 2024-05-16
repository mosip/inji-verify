import React from 'react';
import StepperContentHeader from "./StepperContentHeader";
import Navbar from "./Navbar";
import InjiStepper from "./InjiStepper";

function VerificationProgressTracker() {
    return (
        <div className="bg-[#FAFBFD] bg-no-repeat pt-0 pb-[100px] pr-[60px] pl-[76px] mt-0">
            <Navbar/>
            <StepperContentHeader/>
            <InjiStepper/>
        </div>
    );
}

export default VerificationProgressTracker;
