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

export const ImportFromFile = ({setScanResult}: {setScanResult: SetScanResultFunction}) => {
    const [snackbarMessage, setSnackbarMessage] = useState(AlertMessages.success);

    function handleSnackbarClose () {
        setSnackbarMessage("");
    }

    return (
        <div style={{margin: "12px auto", display: "grid", placeContent: "center"}}>
            <StyledButton style={{width: "350px"}}>
                <label htmlFor={"upload-qr"}>
                    Upload QR Code
                </label>
            </StyledButton>
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
                            if (scanResult.data === null) {
                                setSnackbarMessage(AlertMessages.qrNotDetected);
                            }
                            setSnackbarMessage(AlertMessages.success);
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
