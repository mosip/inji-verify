import React, {useEffect, useState} from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {verify} from "../../../utils/verification-utils";
import {QrScanResult, VcStatus} from "../../../types/types";

const DisplayActiveStep = ({activeStep, setActiveStep}: {
    activeStep: number, setActiveStep: (activeStep: number) => void
}) => {
    const [qrData, setQrData] = useState("");
    const [vc, setVc] = useState(null);
    const [vcStatus, setVcStatus] = useState({status: "Verifying", checks: []} as VcStatus);
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
                    setVcStatus({status: "NOK", checks: []});
                });
        } catch (error) {
            console.error("Error occurred while reading the qrData: ", error);
            setVc(null);
            setVcStatus({status: "NOK", checks: []});
        } finally {
            setQrData("");
            setActiveStep(3);
        }
    }, [qrData]);

    const setScanResult = (result: QrScanResult) => {
        if (!!qrData) {
            // show error message in snackbar
        }
        setQrData(result.data || "");
    }

    switch (activeStep) {
        case 0:
            return (<ScanQrCode setActiveStep={setActiveStep} setScanResult={setScanResult}/>);
        case 1:
        case 2:
            return (<Verification setActiveStep={setActiveStep} setQrData={setQrData}/>);
        case 3:
            return (<Result setActiveStep={setActiveStep} vc={vc} vcStatus={vcStatus}/>);
        default:
            return (<></>);
    }
}

const VerificationSection = ({activeStep, setActiveStep}: {
    activeStep: number,
    setActiveStep: (activeStep: number) => void
}) => {
    return (
        <div>
            <DisplayActiveStep activeStep={activeStep} setActiveStep={setActiveStep}/>
        </div>
    );
}

export default VerificationSection;
