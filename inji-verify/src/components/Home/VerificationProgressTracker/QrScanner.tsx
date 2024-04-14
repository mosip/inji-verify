import React, {useCallback, useEffect, useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import {AlertInfo} from "../../../types/data-types";
import CameraAccessDenied from "../VerificationSection/CameraAccessDenied";
import {ScanSessionExpiryTime, VerificationSteps} from "../../../utils/config";
import {useAlertMessages} from "../../../pages/Home";

const InitialAlert: AlertInfo = {
    message: "",
    severity: undefined,
    open: false
}

function QrScanner({setActiveStep, setQrData}: {
    setQrData: (data: string) => void, setActiveStep: (activeStep: number) => void
}) {
    const [dataRead, setDataRead] = useState(false)
    const isDataRead = useCallback(() => dataRead, [dataRead]);
    const [isCameraBlocked, setIsCameraBlocked] = useState(false);

    const {setAlertInfo} = useAlertMessages();

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveStep(VerificationSteps.ScanQrCodePrompt);
            setAlertInfo({
                open: true,
                message: "The scan session has expired due to inactivity. Please initiate a new scan.",
                severity: "error"
            })
        }, ScanSessionExpiryTime);
        return () => {
            console.log('Clearing timeout');
            clearTimeout(timer)
        };
    }, []);

    return (
        <>
            <Scanner
                onResult={(text, result) => {
                    if (!isDataRead()) {
                        console.log(text, result);
                        setActiveStep(VerificationSteps.Verifying);
                        setQrData(text);
                    }
                }}
                onError={(error) => {
                    setIsCameraBlocked(true);
                }}
                options={{
                    constraints: {
                        "width": {
                            "min": 640,
                            "ideal": 720,
                            "max": 1920
                        },
                        "height": {
                            "min": 640,
                            "ideal": 720,
                            "max": 1080
                        }
                    }
                }}
                styles={{
                    container: {
                        width: "350px",
                        placeContent: "center",
                        display: "grid",
                        placeItems: "center"
                    },
                    video: {
                        zIndex: 1000
                    }
                }}
            />
            <CameraAccessDenied open={isCameraBlocked} handleClose={() => {
                setActiveStep(VerificationSteps.ScanQrCodePrompt);
                setIsCameraBlocked(false)
            }}/>
        </>
    );
}

export default QrScanner;
