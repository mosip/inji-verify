import React, {useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import qr from "../../../assets/qr-icon.png";
import {ReactComponent as TabScanIcon} from "../../../assets/tab-scan.svg";
import StyledButton from "./commons/StyledButton";
import {UploadQrCode} from "./UploadQrCode";
import {useActiveStepContext, useAlertMessages} from "../../../pages/Home";
import {SetScanResultFunction} from "../../../types/function-types";
import {QrScanResult, ScanStatus} from "../../../types/data-types";
import {AlertMessages, VerificationSteps} from "../../../utils/config";
import {useNavigate} from "react-router-dom";

const ScanQrCode = ({setScanResult}: {
    setScanResult: SetScanResultFunction
}) => {
    const {setActiveStep} = useActiveStepContext();
    const {setAlertInfo} = useAlertMessages();
    const [scanStatus, setScanStatus] = useState("NotScanned" as ScanStatus);

    const navigate = useNavigate();

    function checkScanResult(scanResult: QrScanResult) {
        let alertInfo = !!scanResult.data ? AlertMessages.qrUploadSuccess: AlertMessages.qrNotDetected;
        setAlertInfo({
            ...alertInfo,
            open: true
        });
        setScanResult(scanResult);
    }

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
            <Grid item xs={12} order={scanStatus === "Failed" ? 2 : 3}>
                <UploadQrCode
                    setScanResult={checkScanResult}
                    setScanStatus={setScanStatus}
                    displayMessage={scanStatus === "Failed" ? "Upload Another QR Code" : "Upload QR Code"}/>
            </Grid>
            <Grid item xs={12} order={scanStatus === "Failed" ? 3 : 2}>
                <StyledButton
                    icon={<TabScanIcon/>}
                    style={{margin: "6px 0", width: "350px", textAlign: 'center'}}
                    fill
                    onClick={() => {
                        if (!window.navigator.onLine) {
                            navigate('/offline');
                        }
                        else {
                            setActiveStep(VerificationSteps.ActivateCamera)
                        }
                    }}
                >
                    Scan QR Code
                </StyledButton>
            </Grid>
            {
                scanStatus !== "Failed" && (
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
