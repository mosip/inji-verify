import React, {useState} from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import qr from "../../../assets/qr.svg";
import StyledButton from "./commons/StyledButton";
import {ImportFromFile} from "./ImportFromFile";
import {useActiveStepContext, useAlertMessages} from "../../../pages/Home";
import {SetScanResultFunction} from "../../../types/function-types";
import {AlertInfo, QrScanResult, ScanStatus} from "../../../types/data-types";
import AlertMessage from "../../commons/AlertMessage";
import {VerificationSteps} from "../../../utils/config";

const AlertMessages = {
    success: "QR code uploaded successfully!",
    sessionExpired: "The scan session has expired due to inactivity. Please initiate a new scan.",
    qrNotDetected: "No MultiFormat Readers were able to detect the QR code."
};

const ScanQrCode = ({setScanResult}: {
    setScanResult: SetScanResultFunction
}) => {
    const {setActiveStep} = useActiveStepContext();
    const {alertInfo, setAlertInfo} = useAlertMessages();
    const [scanStatus, setScanStatus] = useState("NotScanned" as ScanStatus);

    function handleAlertClose() {
        setAlertInfo((currentAlert: AlertInfo) => {
            return {...currentAlert, open: false} as AlertInfo;
        });
    }

    function checkScanResult(scanResult: QrScanResult) {
        setAlertInfo({
            message: !!scanResult.data ? AlertMessages.success : AlertMessages.qrNotDetected,
            severity: !!scanResult.data ? "success" : "error",
            open: true
        });
        setScanResult(scanResult);
    }

    return (
        <Grid container style={{padding: "78px 104px", textAlign: "center", display: "grid", placeContent: "center"}}>
            <Grid item xs={12} style={{
                font: 'normal normal 600 20px/24px Inter',
                marginBottom: "44px"
            }}>
                <Typography style={{font: 'normal normal 600 20px/24px Inter', padding: '3px 0'}}>
                    Scan QR Code or Upload an Image
                </Typography>
                <Typography style={{font: 'normal normal normal 16px/20px Inter', padding: '3px 0', color: '#717171'}}>
                    Please keep the QR code in the centre & clearly visible.
                </Typography>
            </Grid>
            <Grid item xs={12}>
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
            {
                scanStatus === "Failed" && (
                    <Grid item xs={12}>
                        <ImportFromFile setScanResult={checkScanResult} setScanStatus={setScanStatus} displayMessage="Upload Another QR Code"/>
                    </Grid>
                )
            }
            <Grid item xs={12}>
                <StyledButton style={{margin: "6px 0", width: "350px"}} fill onClick={() => setActiveStep(VerificationSteps.ActivateCamera)}>
                    Scan the QR Code
                </StyledButton>
            </Grid>
            {
                scanStatus !== "Failed" && (
                    <>
                        <Grid item xs={12}>
                            <ImportFromFile setScanResult={checkScanResult} setScanStatus={setScanStatus} displayMessage="Upload QR Code"/>
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'center', display: 'grid', placeContent: 'center'}}>
                            <Typography style={{font: "normal normal normal 14px/17px Inter", color: "#8E8E8E", width: "280px"}}>
                                Allowed file formats: PNG/JPEG/JPG Min Size : 2 x 2 cm | Max Size : 10 x 10 cm
                            </Typography>
                        </Grid>
                    </>
                )
            }
        </Grid>
    );
}

export default ScanQrCode;
