import React from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import qr from "../../../assets/qr.svg";
import StyledButton from "./commons/StyledButton";
import {ImportFromFile} from "./ImportFromFile";
import {useActiveStepContext} from "../../../pages/Home";
import {SetScanResultFunction} from "../../../types/function-types";

const ScanQrCode = ({setScanResult}: {
    setScanResult: SetScanResultFunction
}) => {
    const {setActiveStep} = useActiveStepContext();
    return (
        <Grid container style={{padding: "104px", textAlign: "center"}}>
            <Grid item xs={12} style={{
                font: 'normal normal 600 20px/24px Inter',
                marginBottom: "44px"
            }}>Scan QR Code</Grid>
            <Grid item xs={12}>
                <Box
                    style={{
                        backgroundImage: `url(${scanQr})`,
                        backgroundSize: 'cover',
                        display: 'grid',
                        placeContent: 'center',
                        width: 'calc(min(45vw, 350px))',
                        height: 'calc(min(45vw, 350px))',
                        margin: 'auto'
                    }}
                >
                    <div style={{
                        background: 'rgb(255, 127, 0, 0.1)',
                        borderRadius: '12px',
                        width: 'calc(min(42vw, 320px))',
                        height: 'calc(min(42vw, 320px))',
                        display: 'grid',
                        placeContent: 'center'
                    }}>
                        <img src={qr} style={{width: "100px"}}/>
                    </div>
                </Box>
            </Grid>
            <Grid item xs={12}>
            <StyledButton style={{margin: "40px 0 12px 0", width: "350px"}} fill onClick={() => setActiveStep(1)}>
                    Scan the QR Code
                </StyledButton>
            </Grid>
            <Grid item xs={12}>
                <ImportFromFile setScanResult={setScanResult}/>
            </Grid>
            <Grid item xs={12} style={{textAlign: 'center', display: 'grid', placeContent: 'center'}}>
                <Typography style={{font: "normal normal normal 14px/17px Inter", color: "#8E8E8E", width: "280px"}}>
                    Allowed file formats: PNG/JPEG/JPG Min Size : 2 x 2 cm | Max Size : 10 x 10 cm
                </Typography>
            </Grid>
        </Grid>
    );
}

export default ScanQrCode;
