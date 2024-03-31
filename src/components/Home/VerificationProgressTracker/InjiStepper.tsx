import React from 'react';
import {Box, Step, StepContent, StepLabel, Stepper, Typography} from "@mui/material";

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

const InjiStepper = ({activeStep}: any) => {
    return (
        <Box style={{ marginTop: '30px' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label} style={{alignContent: 'start'}}>
                        <StepLabel>
                            <Typography style={{font: 'normal normal bold 16px/20px Inter'}}>
                                {step.label}
                            </Typography>
                        </StepLabel>
                        <StepContent
                            TransitionProps={{appear: true, unmountOnExit: false}}
                            hidden={false} style={{borderColor: '#FF7F00', display: 'block'}}>
                            <Typography>{step.description}</Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default InjiStepper;
