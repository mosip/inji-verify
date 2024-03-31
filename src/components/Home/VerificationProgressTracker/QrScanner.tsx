import React from 'react';
import {Scanner} from '@yudiel/react-qr-scanner';


function QrScanner({setVerifying, setActiveStep, setQrData}: any) {
    return (
        <Scanner
            onResult={(text, result) => {
                console.log(text, result);
                setVerifying(true);
                setActiveStep(2);
            }}
            onError={(error) => console.log(error?.message)}
            components={{
                tracker: false
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
            }
        }
        />
    );
}

export default QrScanner;
