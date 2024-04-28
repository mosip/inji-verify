import React, {createContext, useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import Copyrights from "../components/Home/VerificationProgressTracker/Copyrights";
import {AlertInfo} from "../types/data-types";
import AlertMessage from "../components/commons/AlertMessage";

function Home(props: any) {
    const [alertInfo, setAlertInfo] = useState({
        open: false,
        severity: 'success',
        message: ''
    } as AlertInfo);
    return (
        <div>
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
        </div>
    );
}

export default Home;
