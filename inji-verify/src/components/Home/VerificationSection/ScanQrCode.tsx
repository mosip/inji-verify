import React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import qr from "../../../assets/qr-icon.png";
import {ReactComponent as TabScanIcon} from "../../../assets/tab-scan.svg";
import StyledButton from "./commons/StyledButton";
import {UploadQrCode} from "./UploadQrCode";
import {VerificationSteps} from "../../../utils/config";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {qrReadInit} from "../../../redux/features/verificationSlice";

const ScanQrCode = () => {
    const dispatch = useAppDispatch();
    const scanStatus = useAppSelector(state => state.qrReadResult?.status);

    return (
        <Grid container style={{padding: "78px 104px", textAlign: "center", display: "grid", placeContent: "center"}}>
            <Grid item xs={12} style={{
                font: 'normal normal 600 20px/24px Inter',
                marginBottom: "44px"
            }} order={0}>
                <Typography style={{font: 'normal normal 600 20px/24px Inter', padding: '3px 0'}}>
                    Scan QR Code or Upload an Image
                </Typography>
                <Typography style={{font: 'normal normal normal 16px/20px Inter', padding: '3px 0', color: '#717171'}}>
                    Please keep the QR code in the centre & clearly visible.
                </Typography>
            </Grid>
            <Grid item xs={12} order={1}>
                <Box
                    style={{
                        backgroundImage: `url(${scanQr})`,
                        backgroundSize: 'cover',
                        display: 'grid',
                        placeContent: 'center',
                        width: 'calc(min(45vw, 350px))',
                        height: 'calc(min(45vw, 350px))',
                        margin: '6px auto'
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
            <Grid item xs={12} order={scanStatus === "FAILED" ? 2 : 3}>
                <UploadQrCode
                    displayMessage={scanStatus === "FAILED" ? "Upload Another QR Code" : "Upload QR Code"}/>
            </Grid>
            <Grid item xs={12} order={scanStatus === "FAILED" ? 3 : 2}>
                <StyledButton
                    icon={<TabScanIcon/>}
                    style={{margin: "6px 0", width: "350px", textAlign: 'center'}} fill onClick={() => dispatch(qrReadInit({activeScreen: VerificationSteps.ActivateCamera, flow: "SCAN"}))}>
                    Scan the QR Code
                </StyledButton>
            </Grid>
            {
                scanStatus !== "FAILED" && (
                    <Grid item xs={12} style={{textAlign: 'center', display: 'grid', placeContent: 'center'}} order={4}>
                        <Typography style={{font: "normal normal normal 14px/17px Inter", color: "#8E8E8E", width: "280px"}}>
                            Allowed file formats: PNG/JPEG/JPG <br/>Min Size : 10KB | Max Size : 5MB
                        </Typography>
                    </Grid>
                )
            }
        </Grid>
    );
}

export default ScanQrCode;
