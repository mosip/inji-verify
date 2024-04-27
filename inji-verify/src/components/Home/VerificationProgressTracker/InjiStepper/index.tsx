import React from 'react';
import {Box, useMediaQuery} from "@mui/material";
import DesktopStepper from "./DesktopStepper";
import MobileStepper from "./MobileStepper";
import {VerificationStep} from "../../../../types/data-types";
import {useAppSelector} from "../../../../redux/hooks";

const steps: VerificationStep[] = [
    {
        label: 'Scan QR Code or Upload QR code',
        description: 'Tap the button and display the QR code shown on your digital credentials / card',
    },
    {
        label: 'Activate your device’s camera',
        description:
            'Activate your device camera for scanning: A notification will be prompt to activate your device camera',
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

const InjiStepper = () => {
    const isDesktop = useMediaQuery('@media (min-width:768px)');
    const activeScreen = useAppSelector(state => state.activeScreen);
    return (
        <Box style={{marginTop: '30px'}}>
            {
                isDesktop
                    ? (<DesktopStepper steps={steps} activeStep={activeScreen}/>)
                    : (<MobileStepper steps={steps} activeStep={activeScreen}/>)
            }
        </Box>
    );
}

export default InjiStepper;
