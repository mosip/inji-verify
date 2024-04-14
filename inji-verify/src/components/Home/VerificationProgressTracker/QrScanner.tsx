import React, {useEffect, useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import CameraAccessDenied from "../VerificationSection/CameraAccessDenied";
import {ScanSessionExpiryTime, VerificationSteps} from "../../../utils/config";
import {useAlertMessages} from "../../../pages/Home";

let timer: NodeJS.Timeout;

function QrScanner({setActiveStep, setQrData}: {
    setQrData: (data: string) => void, setActiveStep: (activeStep: number) => void
}) {
    const [isCameraBlocked, setIsCameraBlocked] = useState(false);

    const {setAlertInfo} = useAlertMessages();

    useEffect(() => {
        timer = setTimeout(() => {
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
                    console.log(text, result);
                    setActiveStep(VerificationSteps.Verifying);
                    setQrData(text);
                }}
                onError={(error) => {
                    console.log('Clearing timeout - camera blocked');
                    clearTimeout(timer);
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
