import React from 'react';
import {Box, Step, StepContent, StepLabel, Stepper, Typography, useMediaQuery} from "@mui/material";
import DesktopStepper from "./DesktopStepper";

const steps = [
    {
        label: 'Scan QR Code',
        description: 'Tap the button and display the QR code shown on your digital certificate / card',
    },
    {
        label: 'Activate your device’s camera',
        description:
            'A notification will prompt to activate your device’s camera',
    },
    {
        label: 'Verification',
        description: 'Validating and verification of your digital document / card'
    },
    {
        label: 'Result',
        description: 'Credibility result of your digital document / card'
    }
];

const InjiStepper = ({activeStep}: {activeStep: number}) => {

    return (
        <Box style={{marginTop: '30px'}}>
            <DesktopStepper steps={steps} activeStep={activeStep}/>
        </Box>
    );
}

export default InjiStepper;
