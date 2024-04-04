import React from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import StyledButton from "./commons/StyledButton";
import {ImportFromFile} from "./ImportFromFile";
import {QrScanResult} from "../../../types/data-types";
import {SetActiveStepFunction, SetScanResultFunction} from "../../../types/function-types";

const ScanQrCode = ({setActiveStep, setScanResult}: {
    setActiveStep: SetActiveStepFunction,
    setScanResult: SetScanResultFunction
}) => {
    return (
        <Grid container style={{padding: "104px", textAlign: "center"}}>
            <Grid item xs={12} style={{
                font: 'normal normal 600 20px/24px Inter',
                marginBottom: "44px"
            }}>Scan QR Code</Grid>
            <Grid item xs={12}>
                <img src={scanQr} style={{width: "calc(min(45vw, 350px))"}}/>
            </Grid>
            <Grid item xs={12}>
                <StyledButton style={{margin: "40px 0 10px 0"}} onClick={() => setActiveStep(1)}>
                    Scan the QR Code
                </StyledButton>
            </Grid>
            <Grid item xs={12}>
                OR
            </Grid>
            <Grid item xs={12}>
                <ImportFromFile setScanResult={setScanResult}/>
            </Grid>
        </Grid>
    );
}

export default ScanQrCode;