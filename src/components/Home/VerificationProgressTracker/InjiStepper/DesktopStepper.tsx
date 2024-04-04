import React from 'react';
import {Box, Step, StepContent, StepLabel, Stepper, Typography} from "@mui/material";
import {InjiStepperStep} from "../../../../types/data-types";

function DesktopStepper({steps, activeStep}: {steps: InjiStepperStep[], activeStep: number}) {
    return (
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
    );
}

export default DesktopStepper;