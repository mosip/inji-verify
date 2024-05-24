import React from 'react';
import DesktopStepper from "./DesktopStepper";
import MobileStepper from "./MobileStepper";

function VerificationProgressTracker() {
    return (
        <div className="bg-[#FAFBFD] bg-no-repeat pt-0 pb-[100px] pr-[60px] pl-[76px] mt-0">
            <DesktopStepper/>
            <MobileStepper/>
        </div>
    );
}

export default VerificationProgressTracker;
