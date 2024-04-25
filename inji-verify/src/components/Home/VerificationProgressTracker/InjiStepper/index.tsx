import React from 'react';
import {Box, Step, StepContent, StepLabel, Stepper, Typography, useMediaQuery} from "@mui/material";
import DesktopStepper from "./DesktopStepper";
import MobileStepper from "./MobileStepper";
import {VerificationStep} from "../../../../types/data-types";
import {useActiveStepContext} from "../../../../pages/Home";

const steps: VerificationStep[] = [
    {
        label: 'Select ‘Scan QR Code’ or ‘Upload QR Code’ ',
        description: ['Tap \'Scan QR Code\' and scan to capture the QR code shown on your digital credentials/card.', 'Tap ‘Upload QR Code’ to upload the preferred file.'],
    },
    {
        label: 'Activate your device’s camera',
        description:
            'Activate your device camera for scanning: A notification will be prompt to activate your device camera (Valid for ‘Scan QR Code’ feature only)',
    },
    {
        label: 'Verify document',
        description: 'Allow Inji Verify to verify & validate the digital document / card'
    },
    {
        label: 'View result',
        description: 'Check the validation result'
    }
];

const InjiStepper = () => {
    const isDesktop = useMediaQuery('@media (min-width:768px)');
    const {getActiveStep} = useActiveStepContext();
    const activeStep = getActiveStep();

    return (
        <Box style={{marginTop: '30px'}}>
            {
                isDesktop
                    ? (<DesktopStepper steps={steps} activeStep={activeStep}/>)
                    : (<MobileStepper steps={steps} activeStep={activeStep}/>)
            }
        </Box>
    );
}

export default InjiStepper;
