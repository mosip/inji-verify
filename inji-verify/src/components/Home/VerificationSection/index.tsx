import React, {useEffect} from 'react';
import ScanQrCode from "./ScanQrCode";
import Verification from "./Verification";
import Result from "./Result";
import {verify} from "../../../utils/verification-utils";
import {useAlertMessages} from "../../../pages/Home";
import {useNavigate} from "react-router-dom";
import {decodeQrData} from "../../../utils/qr-utils";
import {AlertMessages, VerificationSteps} from "../../../utils/config";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {goHomeScreen, verificationComplete} from "../../../redux/features/verificationSlice";

const DisplayActiveStep = () => {
    const {activeScreen, qrData} = useAppSelector(state => ({activeScreen: state.activeScreen, qrData: state.qrReadResult?.qrData}));
    const dispatch = useAppDispatch();

    const {setAlertInfo} = useAlertMessages();

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Qr data changed: ", qrData);
        if (!(!!qrData)) return;
        let vc: any;
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
                    dispatch(verificationComplete({verificationResult: {vc, vcStatus: status}}))
                })
                .catch(error => {
                    console.error("Error occurred while verifying the VC: ", error);
                    console.error("Error code: ", error.code);
                    if (!window.navigator.onLine) {
                        navigate('/offline');
                        return;
                    }
                });
        } catch (error) {
            console.error("Error occurred while reading the qrData: ", error);
            dispatch(verificationComplete({
                verificationResult: {
                    vcStatus: {
                        status: "NOK", checks:
                            []
                    },
                    vc: null
                }
        }));
        }
    }, [qrData]);

    switch (activeScreen) {
        case VerificationSteps.ScanQrCodePrompt:
            return (<ScanQrCode/>);
        case VerificationSteps.ActivateCamera:
        case VerificationSteps.Verifying:
            return (<Verification/>);
        case VerificationSteps.DisplayResult:
            return (<Result/>);
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
