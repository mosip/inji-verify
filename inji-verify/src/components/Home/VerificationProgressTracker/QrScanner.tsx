import React, {useCallback, useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import AlertMessage from "../../commons/AlertMessage";
import {AlertInfo} from "../../../types/data-types";
import CameraAccessDenied from "../VerificationSection/CameraAccessDenied";
import StyledButton from "../VerificationSection/commons/StyledButton";

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

    const [alert, setAlert] = useState(InitialAlert);

    const [isCameraBlocked, setIsCameraBlocked] = useState(false);

    return (
        <>
            <Scanner
                enabled={!dataRead}
                onResult={(text, result) => {
                    if (!isDataRead()) {
                        console.log(text, result);
                        setActiveStep(2);
                        setQrData(text);
                        setDataRead(true);
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
                    },
                    delayBetweenScanSuccess: 500,
                    delayBetweenScanAttempts: 50,
                    tryPlayVideoTimeout: 1000
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
                setActiveStep(0);
                setIsCameraBlocked(false)
            }}/>
        </>
    );
}

export default QrScanner;
