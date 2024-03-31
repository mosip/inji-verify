import React from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import StyledButton from "./commons/StyledButton";

const ScanQrCode = ({setActiveStep}: {
    setActiveStep: (activeStep: number) => void
}) => {
    return (
        <Grid container style={{padding: "104px", textAlign: "center"}}>
            <Grid item xs={12} style={{
                font: 'normal normal 600 20px/24px Inter',
                marginBottom: "44px"
            }}>Scan QR Code</Grid>
            <Grid item xs={12}>
                <img src={scanQr} width={350}/>
            </Grid>
            <Grid item xs={12}>
                <StyledButton style={{margin: "40px 0"}} onClick={() => setActiveStep(1)}>
                    Scan the QR Code
                </StyledButton>
            </Grid>
        </Grid>
    );
}

export default ScanQrCode;
