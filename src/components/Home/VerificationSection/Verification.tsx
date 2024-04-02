import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import scanQr from "../../../assets/scanner-ouline.svg";
import Loader from "../../commons/Loader";
import QrScanner from "../VerificationProgressTracker/QrScanner";
import {verify} from "../../../utils/verification-utils";

const Verification = ({setVc, setVcStatus, setActiveStep}: {
    setVc: (vc: any) => void, setVcStatus: (status: any) => void, setActiveStep: (activeStep: number) => void
}) => {
    const [verifying, setVerifying] = useState(false);
    const [qrData, setQrData] = useState("");

    useEffect(() => {
        if (qrData === "") return;
        try {
            let vc = JSON.parse(qrData);
            verify(vc)
                .then(status => {
                    setVc(vc);
                    setVcStatus(status);
                    setActiveStep(3);
                })
                .catch(error => {
                    console.error("Error occurred while verifying the VC: ", error);
                    setVc(null);
                    setVcStatus({status: "NOK"});
                });
        } catch (error) {
            console.error("Error occurred while reading the qrData: ", error);
            setVc(null);
            setVcStatus({status: "NOK"});
        } finally {
            setQrData("");
            setActiveStep(3);
        }
    }, [qrData]);

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
