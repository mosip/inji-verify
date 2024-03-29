import React, {useState} from 'react';
import PromptToScan from "./PromptToScan.js";
import ScanQr from "./ScanQr.jsx";
import PropTypes from "prop-types";

function ScanAndVerify({readQrData}) {
    const [scanning, setScanning] = useState(false);
    return scanning ? (
        (<ScanQr setScanning={setScanning} onScan={readQrData}/>)
    ): (<PromptToScan setScanning={setScanning}/>);
}

ScanAndVerify.propTypes = {
    readQrData: PropTypes.func.isRequired
}

export default ScanAndVerify;
