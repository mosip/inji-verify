import React from 'react';
import QrReader from "react-qr-scanner";
import StyledButton from "../commons/StyledButton.js";
import PropTypes from "prop-types";
import {DISPLAY_TEXT, SUPPORTED_LANGUAGE} from "../../utils/config.js";
import {QrScannerPreviewStyle} from "./styles.js";

function ScanQr({setScanning, onScan}) {
    return (
        <div>
            <QrReader
                delay={100}
                style={QrScannerPreviewStyle}
                onError={(error) => {
                    console.log("Error occurred while reading the qr code: ", error);
                    onScan(null);
                }}
                onScan={onScan}
            />
            <br/>
            <StyledButton onClick={() => {setScanning(false)}}>
                <span>{DISPLAY_TEXT[SUPPORTED_LANGUAGE].back}</span>
            </StyledButton>
        </div>
    );
}

ScanQr.propTypes = {
    setScanning: PropTypes.func.isRequired,
    onScan: PropTypes.func.isRequired
}

export default ScanQr;
