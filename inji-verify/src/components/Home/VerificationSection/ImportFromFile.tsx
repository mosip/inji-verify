import {scanFilesForQr} from "../../../utils/qr-utils";
import {QrScanResult} from "../../../types/data-types";
import {SetScanResultFunction} from "../../../types/function-types";
import StyledButton from "./commons/StyledButton";
import {Alert, Snackbar} from "@mui/material";
import {useState} from "react";

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
    const [snackbarMessage, setSnackbarMessage] = useState(AlertMessages.success);

    function handleSnackbarClose() {
        setSnackbarMessage("");
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
                    scanFilesForQr(file)
                        .then(scanResult => {
                            setSnackbarMessage(!!scanResult.data ? AlertMessages.success : AlertMessages.qrNotDetected);
                            setScanResult(scanResult);
                        });
                }}
            />
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage("")}
                message={snackbarMessage}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarMessage === AlertMessages.success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                    style={{
                        borderRadius: '10px',
                        padding: '16px 18px'
                    }}

                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>);
}
