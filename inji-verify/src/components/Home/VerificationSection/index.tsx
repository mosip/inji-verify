import React, {useEffect, useState} from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {verify} from "../../../utils/verification-utils";
import {QrScanResult, VcStatus} from "../../../types/data-types";
import {useActiveStepContext, useAlertMessages} from "../../../pages/Home";
import {useNavigate} from "react-router-dom";
import {decodeQrData} from "../../../utils/qr-utils";
import {AlertMessages, VerificationSteps} from "../../../utils/config";

const DisplayActiveStep = () => {
    const {getActiveStep, setActiveStep} = useActiveStepContext();
    const {setAlertInfo} = useAlertMessages();
    const activeStep = getActiveStep();

    const navigate = useNavigate();

    const [qrData, setQrData] = useState("");
    const [vc, setVc] = useState(null);
    const [vcStatus, setVcStatus] = useState({status: "Verifying", checks: []} as VcStatus);

    useEffect(() => {
        if (qrData === "") return;
        let vc: any;
        setActiveStep(VerificationSteps.Verifying);
        try {
            vc = JSON.parse(decodeQrData(qrData));
        }
        catch (error) {
            setActiveStep(VerificationSteps.ScanQrCodePrompt);
            setAlertInfo({...AlertMessages.qrNotSupported, open: true})
            setQrData("");
            return;
        }
        try {
            verify(vc)
                .then(status => {
                    console.log("Status: ", status);
                    // did-resolution fails if the internet is not available and proof can't be verified
                    if (status?.checks?.proof === "NOK"
                        && !window.navigator.onLine) {
                        navigate('/offline');
                    }
                    setVcStatus(status);
                    if (status?.status === "OK") {
                        setVc(vc);
                    }
                })
                .catch(error => {
                    console.error("Error occurred while verifying the VC: ", error);
                    console.error("Error code: ", error.code);
                    if (!window.navigator.onLine) {
                        navigate('/offline');
                        return;
                    }
                    setVc(null);
                    setVcStatus({status: "NOK", checks: []});
                }).finally(() => {
                    setQrData("");
                    setActiveStep(VerificationSteps.DisplayResult);
            });
        } catch (error) {
            console.error("Error occurred while reading the qrData: ", error);
            setQrData("");
            setVc(null);
            setVcStatus({status: "NOK", checks: []});
            setActiveStep(VerificationSteps.DisplayResult);
        }
    }, [qrData]);

    const setScanResult = (result: QrScanResult) => {
        if (!!qrData) {
            // show error message in snackbar
        }
        setQrData(result.data || "");
        if (!result.data) {
            setActiveStep(VerificationSteps.ScanQrCodePrompt);
        }
    }

    switch (activeStep) {
        case VerificationSteps.ScanQrCodePrompt:
            return (<ScanQrCode setScanResult={setScanResult}/>);
        case VerificationSteps.ActivateCamera:
        case VerificationSteps.Verifying:
            return (<Verification setQrData={setQrData}/>);
        case VerificationSteps.DisplayResult:
            return (<Result setActiveStep={setActiveStep} vc={vc} vcStatus={vcStatus}/>);
        default:
            return (<></>);
    }
}

const VerificationSection = () => {
    return (
        <div>
            <DisplayActiveStep/>
        </div>
    );
}

export default VerificationSection;
