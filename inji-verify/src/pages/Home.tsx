import React, {useState} from 'react';
import {Grid} from "@mui/material";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import Copyrights from "../components/Home/VerificationProgressTracker/Copyrights";
import {VerificationSteps} from "../utils/config";
import {AlertInfo} from "../types/data-types";
import AlertMessage from "../components/commons/AlertMessage";
import ActiveStepContext from "../hooks/useActiveStepContext";
import {AlertsContext} from "../hooks/useAlertMessages";

function Home(props: any) {
    const [activeStep, setActiveStep] = useState(VerificationSteps.ScanQrCodePrompt);
    const getActiveStep = () => activeStep;

    const [alertInfo, setAlertInfo] = useState({
        open: false,
        severity: 'success',
        message: ''
    } as AlertInfo);

    return (
        <AlertsContext.Provider value={{alertInfo, setAlertInfo}}>
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
                <AlertMessage alertInfo={alertInfo} handleClose={() => {setAlertInfo({...alertInfo, open: false})}}/>
            </ActiveStepContext.Provider>
        </AlertsContext.Provider>
    );
}

export default Home;
