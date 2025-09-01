import React from 'react';
import DesktopStepper from "./DesktopStepper";
import MobileStepper from "./MobileStepper";
import {isMobileDevice} from "../../../utils/config";

function VerificationProgressTracker() {
    return (
        <div className="bg-background lg:bg-stepperBackGround bg-no-repeat">
            {!isMobileDevice() && <DesktopStepper/>}
            {isMobileDevice() && <MobileStepper/>}
        </div>
    );
}

export default VerificationProgressTracker;
