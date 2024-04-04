import React, {useEffect, useState} from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {verify} from "../../../utils/verification-utils";
import {SetActiveStepFunction} from "../../../types/function-types";
import {QrScanResult, VcStatus} from "../../../types/data-types";
import {useActiveStepContext} from "../../../pages/Home";

const DisplayActiveStep = () => {
    const {getActiveStep, setActiveStep} = useActiveStepContext();
    const activeStep = getActiveStep();

    const [qrData, setQrData] = useState("");
    const [vc, setVc] = useState(null);
    const [vcStatus, setVcStatus] = useState({status: "Verifying", checks: []} as VcStatus);
    useEffect(() => {
        if (qrData === "") return;
        try {
            let vc = JSON.parse(qrData);
            // TODO: is it a vc? - check format
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
        setActiveStep(2);
        setQrData(result.data || "");
    }

    switch (activeStep) {
        case 0:
            return (<ScanQrCode setScanResult={setScanResult}/>);
        case 1:
            return (<Verification setQrData={setQrData} verifying={false}/>);
        case 2:
            return (<Verification setQrData={setQrData} verifying={true}/>);
        case 3:
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
