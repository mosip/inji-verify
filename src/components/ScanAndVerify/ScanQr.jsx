import React from 'react';
import QrReader from "react-qr-scanner";
import StyledButton from "../commons/StyledButton.js";

function ScanQr({setScanning, setQrData, onScan}) {
    const previewStyle = {
        height: 480,
        width: 640,
    };

    return (
        <div>
            <QrReader
                delay={100}
                style={previewStyle}
                onError={(error) => {
                    console.log("Error occurred while reading the qr code: ", error);
                    onScan(null);
                }}
                onScan={onScan}
            />
            <br/>
            <StyledButton onClick={() => {setScanning(false)}}>
                <span>Back</span>
            </StyledButton>
        </div>
    );
}

export default ScanQr;
