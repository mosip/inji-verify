import React, {createContext, useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import Copyrights from "../components/Home/VerificationProgressTracker/Copyrights";

let activeStep: number = 0;
const setActiveStep = (newValue: number) => {
    console.log("Setting active step to: ", newValue);
    activeStep = newValue;
}
const getActiveStep = () => activeStep;

const ActiveStepContext = createContext({getActiveStep, setActiveStep});

export const useActiveStepContext = () => useContext(ActiveStepContext);

function Home(props: any) {
    const [activeStep, setActiveStep] = useState(0);
    const getActiveStep = () => activeStep;
    return (
        <ActiveStepContext.Provider value={{getActiveStep, setActiveStep}}>
            <Grid container>
                <Grid item xs={12} md={6} style={{
                    background: '#FAFBFD 0 0 no-repeat padding-box'
                }}>
                    <VerificationProgressTracker/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <VerificationSection/>
                </Grid>
            </Grid>
            <Copyrights/>
        </ActiveStepContext.Provider>
    );
}

export default Home;
