import React from 'react';
import {Step, StepLabel, Stepper} from "@mui/material";
import {VerificationStep} from "../../../../types/data-types";
import StepperIcon from "./StepperIcon";
import {StepperConnector} from "./StepperConnector";
import {StepContentContainer, StepContentDescription, StepLabelContent} from "./styles";

const getDescriptionContent = (description: string | string[]): string | React.ReactElement => {
    if (typeof description === 'string') {
        return description;
    }
    return (<>
        {description.map(point => (<><span>{point}</span><br/></>))}
    </>);
}

function DesktopStepper({steps, activeStep}: {steps: VerificationStep[], activeStep: number}) {
    return (
        <Stepper activeStep={activeStep} orientation="vertical" connector={<StepperConnector/>}>
            {steps.map((step, index) => (
                <Step key={step.label} expanded>
                    <StepLabel StepIconComponent={StepperIcon}>
                        <StepLabelContent>
                            {step.label}
                        </StepLabelContent>
                    </StepLabel>
                    <StepContentContainer
                        TransitionProps={{appear: true, unmountOnExit: false}}
                        hidden={false}>
                        <StepContentDescription>
                            {getDescriptionContent(step.description)}
                        </StepContentDescription>
                    </StepContentContainer>
                </Step>
            ))}
        </Stepper>
    );
}

export default DesktopStepper;