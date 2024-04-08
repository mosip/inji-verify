import React from 'react';
import {Box, Step, StepContent, StepLabel, Stepper, Typography} from "@mui/material";
import {InjiStepperStep} from "../../../../types/data-types";
import InjiStepperIcon from "./InjiStepperIcon";
import {InjiConnector} from "./InjiConnector";

function DesktopStepper({steps, activeStep}: {steps: InjiStepperStep[], activeStep: number}) {
    return (
        <Stepper activeStep={activeStep} orientation="vertical" connector={<InjiConnector/>}>
            {steps.map((step, index) => (
                <Step key={step.label} style={{alignContent: 'start'}} expanded>
                    <StepLabel StepIconComponent={InjiStepperIcon}>
                        <Typography style={{font: 'normal normal bold 16px/20px Inter'}}>
                            {step.label}
                        </Typography>
                    </StepLabel>
                    <StepContent
                        TransitionProps={{appear: true, unmountOnExit: false}}
                        hidden={false} style={{borderColor: '#FF7F00', paddingBottom: "30px", display: 'block'}}>
                        <Typography
                            style={{
                                font: 'normal normal normal 14px/19px Inter',
                                color: '#535353'
                            }}>
                            {step.description}
                        </Typography>
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    );
}

export default DesktopStepper;