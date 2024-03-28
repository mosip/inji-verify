import React, {useState} from 'react';
import PromptToScan from "./PromptToScan.js";
import ScanQr from "./ScanQr.jsx";

function ScanAndVerify({readQrData}) {
    const [scanning, setScanning] = useState(false);
    return scanning ? (
        (<ScanQr setScanning={setScanning} onScan={readQrData}/>)
    ): (<PromptToScan setScanning={setScanning}/>);
}

export default ScanAndVerify;
