import React, {useEffect, useState} from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {verify} from "../../../utils/verification-utils";
import {QrScanResult, VcStatus} from "../../../types/data-types";
import {useAlertMessages} from "../../../pages/Home";
import {useNavigate} from "react-router-dom";
import {decodeQrData} from "../../../utils/qr-utils";
import {AlertMessages, VerificationSteps} from "../../../utils/config";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {goHomeScreen, verificationComplete, verificationInit} from "../../../redux/features/verificationSlice";

const DisplayActiveStep = () => {
    const activeScreen = useAppSelector(state => state.activeScreen);
    const dispatch = useAppDispatch();

    const {setAlertInfo} = useAlertMessages();

    const navigate = useNavigate();

    const [qrData, setQrData] = useState("");
    const [vc, setVc] = useState(null);
    const [vcStatus, setVcStatus] = useState({status: "Verifying", checks: []} as VcStatus);

    useEffect(() => {
        if (qrData === "") return;
        let vc: any;
        dispatch(verificationInit({activeScreen: VerificationSteps.Verifying}));
        try {
            vc = JSON.parse(decodeQrData(qrData));
        }
        catch (error) {
            dispatch(goHomeScreen({}));
            setAlertInfo({...AlertMessages.qrNotSupported, open: true})
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
                    setVc(vc);
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
                    dispatch(verificationComplete({activeScreen: VerificationSteps.DisplayResult}));
            });
        } catch (error) {
            console.error("Error occurred while reading the qrData: ", error);
            setQrData("");
            setVc(null);
            setVcStatus({status: "NOK", checks: []});
            dispatch(verificationComplete({activeScreen: VerificationSteps.DisplayResult, vcStatus: {status: "NOK", checks: []}, vc: null}));
        }
    }, [qrData]);

    const setScanResult = (result: QrScanResult) => {
        if (!!qrData) {
            // show error message in snackbar
        }
        setQrData(result.data || "");
        if (!result.data) {
            dispatch(goHomeScreen({}));
        }
    }

    switch (activeScreen) {
        case VerificationSteps.ScanQrCodePrompt:
            return (<ScanQrCode setScanResult={setScanResult}/>);
        case VerificationSteps.ActivateCamera:
        case VerificationSteps.Verifying:
            return (<Verification setQrData={setQrData}/>);
        case VerificationSteps.DisplayResult:
            return (<Result vc={vc} vcStatus={vcStatus}/>);
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
