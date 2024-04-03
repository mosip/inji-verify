import React from 'react';
import {Box, Step, StepContent, StepLabel, Stepper, Typography} from "@mui/material";

function DesktopStepper({steps, activeStep}: {steps: {label: string, description: string}[], activeStep: number}) {
    return (
        <Stepper style={{maxHeight: '350px'}} activeStep={activeStep} orientation="horizontal" alternativeLabel>
            {steps.map((step, index) => (
                <Step key={step.label} style={{alignContent: 'start'}}>
                    <StepLabel>
                        <Typography style={{font: 'normal normal bold 16px/20px Inter'}}>
                            {step.label}
                        </Typography>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

export default DesktopStepper;