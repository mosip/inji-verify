import React from 'react';
import {Scanner, useContinuousScanner} from '@yudiel/react-qr-scanner';
import Result from "../VerificationSection/Result";


function QrScanner({setVerifying}: any) {
    const scannerHook = useContinuousScanner({
        options: {

        },
        audio: true,
        onError: (error) => console.log(error?.message),
        onResult: (result) => console.log(result)
    });
    return (
        <Scanner
            onResult={(text, result) => {
                console.log(text, result);
                setVerifying(true)
            }}
            onError={(error) => console.log(error?.message)}

            components={{
                tracker: true,
                audio: true
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
                    height: "350px",
                    placeContent: "center",
                    display: "grid",
                    placeItems: "center"
                }
            }}
        />
    );
}

export default QrScanner;