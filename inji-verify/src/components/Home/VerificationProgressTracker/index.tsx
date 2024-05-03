import React from 'react';
import StepperContentHeader from "./StepperContentHeader";
import Navbar from "./Navbar";
import InjiStepper from "./InjiStepper";

function VerificationProgressTracker() {
    return (
        <div className="bg-[#FAFBFD] bg-no-repeat py-0 pr-[60px] pl-[76px] max-h-[100vh] mt-0">
            <Navbar/>
            <StepperContentHeader/>
            <InjiStepper/>
        </div>
    );
}

export default VerificationProgressTracker;
