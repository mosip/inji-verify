import React, {useState} from 'react';
import {Box, Grid, IconButton, Step, StepLabel, Stepper} from "@mui/material";
import {VerificationStep} from "../../../../types/data-types";
import {StepLabelContent} from "./styles";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";

function MobileStepper({steps, activeStep}: {steps: VerificationStep[], activeStep: number}) {
    const [open, setOpen] = useState(false);
    return (
        <Box style={{
            width: '100vw', maxHeight: '350px', position: "fixed",
            bottom: 0, left: 0, zIndex: 1000, backgroundColor: "white", paddingTop: 16, paddingBottom: open? 16 : 0,
        }}>
            <Grid container style={{display: "flex"}}>
                <Grid item xs={10}>
                    <Stepper activeStep={activeStep} orientation="horizontal" alternativeLabel style={{paddingRight: 0}}>
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel>
                                    <StepLabelContent style={{fontWeight: 400}}>
                                        {open ? step.label : ""}
                                    </StepLabelContent>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <Grid item xs={2}>
                    <IconButton size='large'
                                style={{height: 12}}
                                onClick={() => {setOpen(open =>!open)}}>
                        {open ? (<ArrowDropDown fontSize='large'/>) : (<ArrowDropUp fontSize='large'/>)}
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MobileStepper;
