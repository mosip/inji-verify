import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import Loader from "../../commons/Loader";
import QrScanner from "../VerificationProgressTracker/QrScanner";
import {verify} from "../../../utils/verification-utils";
import {SetActiveStepFunction, SetQrDataFunction} from "../../../types/function-types";

const Verification = ({setQrData, setActiveStep}: {
    setQrData: SetQrDataFunction, setActiveStep: SetActiveStepFunction
}) => {
    const [verifying, setVerifying] = useState(false);

    return (
        <Grid container style={{padding: "104px", textAlign: "center", placeContent: "center"}}>
            <Grid item xs={12} style={{
                font: 'normal normal 600 20px/24px Inter',
                marginBottom: "44px"
            }}>
                <Typography style={{font: 'normal normal 600 20px/24px Inter', marginBottom: '8px'}}>
                    Verification in Progress
                </Typography>
                <Typography style={{font: 'normal normal normal 16px/20px Inter'}}>
                    This verification will take sometime, please don’t close the browser.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Box style={{
                    width: "350px",
                    height: "350px",
                    backgroundImage: `url(${scanQr})`,
                    backgroundSize: "cover",
                    display: "grid",
                    placeContent: "center",
                    margin: "auto",
                }}>
                    {
                        verifying
                            ? (<Loader/>)
                            : (<QrScanner
                                setVerifying={setVerifying}
                                setActiveStep={setActiveStep}
                                setQrData={setQrData}
                            />)
                    }
                </Box>
            </Grid>
        </Grid>
    );
}

export default Verification;