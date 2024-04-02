import React, {useCallback, useState} from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';


function QrScanner({setVerifying, setActiveStep, setQrData}: any) {
    const [dataRead, setDataRead] = useState(false)
    const isDataRead = useCallback(() => dataRead, [dataRead]);


    return (
        <Scanner
            enabled={!dataRead}
            onResult={(text, result) => {
                if (!isDataRead()) {
                    console.log(text, result);
                    setVerifying(true);
                    setActiveStep(2);
                    setQrData(text);
                    setDataRead(true);
                }
            }}
            onError={(error) => console.log(error?.message)}
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
                },
                finderBorder: 10
            }
        }
        />
    );
}

export default QrScanner;
