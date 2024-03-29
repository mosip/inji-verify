import React, {useState} from 'react';
import ScanAndVerify from "../components/ScanAndVerify";
import VerificationResult from "../components/VerificationResult.jsx";

function Home(props) {
    const [qrData, setQrData] = useState();
    return qrData
        ? (<VerificationResult qrData={qrData} back={() => setQrData(null)}/>)
        : (<ScanAndVerify readQrData={setQrData}/>);
}

export default Home;
