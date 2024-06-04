import React, {useEffect, useRef, useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';
import CameraAccessDenied from "./CameraAccessDenied";
import {ScanSessionExpiryTime} from "../../../utils/config";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, verificationInit} from "../../../redux/features/verification/verification.slice";
import {raiseAlert} from "../../../redux/features/alerts/alerts.slice";
import "./ScanningLine.css";

let timer: NodeJS.Timeout;

function QrScanner() {
    const dispatch = useAppDispatch();
    const [isCameraBlocked, setIsCameraBlocked] = useState(false);

    const scannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        timer = setTimeout(() => {
            dispatch(goHomeScreen({}));
            dispatch(raiseAlert({
                open: true,
                message: "The scan session has expired due to inactivity. Please initiate a new scan.",
                severity: "error"
            }))
        }, ScanSessionExpiryTime);
        return () => {
            console.log('Clearing timeout');
            clearTimeout(timer)
        };
    }, []);

    useEffect(() => {
        // Disable inbuilt border around the video
        if (scannerRef?.current) {
            let svgElements = scannerRef?.current?.getElementsByTagName('svg');
            if (svgElements.length === 1) {
                svgElements[0].style.display = 'none';
            }
        }
    }, [scannerRef]);

    return (
        <div ref={scannerRef} className="relative">
            {
                !isCameraBlocked && (
                    <div
                        className="absolute top-[-15px] left-[-15px] h-[280px] w-[280px] lg:top-[-12px] lg:left-[-12px] lg:h-[340px] lg:w-[340px] flex items-center justify-center">
                        <div className="scanning-line"></div>
                    </div>
                )
            }
            <Scanner
                onResult={(text, result) => {
                    console.log(text, result);
                    dispatch(verificationInit({qrReadResult: {qrData: text, status: "SUCCESS"}, flow: "SCAN"}));
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
                        },
                        facingMode: "environment"
                    },
                    delayBetweenScanSuccess: 1000000 // Scan once
                }}
                styles={{
                    container: {
                        width: window.innerWidth < 1024 ? "250px" : "316px",
                        placeContent: "center",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "12px"
                    }
                }}
            />
            <CameraAccessDenied open={isCameraBlocked} handleClose={() => {
                console.log("closing camera");
                dispatch(goHomeScreen({}));
                setIsCameraBlocked(false)
            }}/>
        </div>
    );
}

export default QrScanner;
