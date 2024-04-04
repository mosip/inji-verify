import {scanFilesForQr} from "../../../utils/qr-utils";
import {AlertInfo} from "../../../types/data-types";
import {SetScanResultFunction} from "../../../types/function-types";
import {useState} from "react";
import AlertMessage from "../../commons/AlertMessage";
import {useActiveStepContext} from "../../../pages/Home";

const AlertMessages = {
    success: "QR code uploaded successfully!",
    sessionExpired: "The scan session has expired due to inactivity. Please initiate a new scan.",
    qrNotDetected: "No MultiFormat Readers were able to detect the QR code."
};

function UploadButton() {
    return (
        <label
            style={{
                background: `#FFFFFF 0% 0% no-repeat padding-box`,
                border: '2px solid #FF7F00',
                borderRadius: '9999px',
                opacity: 1,
                padding: '18px 0',
                color: '#FF7F00',
                width: '350px',
                cursor: 'pointer'
            }}
            htmlFor={"upload-qr"}>
            Upload QR Code
        </label>
    );
}

export const ImportFromFile = ({setScanResult}: { setScanResult: SetScanResultFunction }) => {
    const [alert, setAlert] = useState({open: false} as AlertInfo);
    const {setActiveStep} = useActiveStepContext();

    function handleAlertClose() {
        setAlert({open: false});
    }

    return (
        <div style={{margin: "12px auto", display: "grid", placeContent: "center"}}>
            <UploadButton/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg, .jpg, .pdf"
                style={{
                    margin: "8px auto",
                    display: "none"
                }}
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;

                    setActiveStep(2);// verifying
                    scanFilesForQr(file)
                        .then(scanResult => {
                            setAlert({
                                message: !!scanResult.data ? AlertMessages.success : AlertMessages.qrNotDetected,
                                severity: !!scanResult.data ? "success" : "error",
                                open: true
                            });
                            setScanResult(scanResult);
                        });
                }}
            />
            <AlertMessage alertInfo={alert} handleClose={handleAlertClose}/>
        </div>);
}
