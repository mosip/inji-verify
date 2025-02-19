import React from 'react';
import DesktopStepper from "./DesktopStepper";
import MobileStepper from "./MobileStepper";

function VerificationProgressTracker() {
    return (
        <div className="bg-white bg-no-repeat">
            <DesktopStepper/>
            <MobileStepper/>
        </div>
    );
}

export default VerificationProgressTracker;
