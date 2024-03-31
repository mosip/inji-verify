import React from 'react';
import {Grid} from "@mui/material";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";

function Home(props: any) {
    return (
        <Grid container>
            <Grid item xs={6}>
                <VerificationProgressTracker activeStep={1}/>
            </Grid>
            <Grid item xs={6}>
                <VerificationSection activeStep={1}/>
            </Grid>
        </Grid>
    );
}

export default Home;
