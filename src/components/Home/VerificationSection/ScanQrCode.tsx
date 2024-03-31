import React from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scan-qr.png";

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
                <Button style={{margin: "20px 0"}} onClick={() => setActiveStep(1)}>
                    Scan the QR Code
                </Button>
            </Grid>
        </Grid>
    );
}

export default ScanQrCode;
