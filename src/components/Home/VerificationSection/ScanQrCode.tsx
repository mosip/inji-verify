import React from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import StyledButton from "./commons/StyledButton";

import scanQr from "../../../assets/scanner-ouline.svg";
import qrImage from "../../../assets/qr.svg";

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
                <Box style={{
                    backgroundImage: `url(${scanQr})`,
                    backgroundSize: 'cover',
                    width: '300px',
                    height: '300px',
                    padding: '24px',
                    margin: "auto"
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                        display: "grid",
                        placeContent: "center",
                        opacity: 0.05,
                        backgroundColor: '#FF7F00',
                    }}>
                        <img src={qrImage} width={'100px'}/>
                    </div>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <StyledButton style={{margin: "40px 0"}} fill onClick={() => setActiveStep(1)}>
                    Scan the QR Code
                </StyledButton>
            </Grid>
        </Grid>
    );
}

export default ScanQrCode;
