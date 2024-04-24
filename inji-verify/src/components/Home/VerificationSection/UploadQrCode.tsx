import {scanFilesForQr} from "../../../utils/qr-utils";
import {ScanStatus} from "../../../types/data-types";
import {SetScanResultFunction} from "../../../types/function-types";
import {useActiveStepContext, useAlertMessages} from "../../../pages/Home";
import {AlertMessages, UploadFileSizeLimits, VerificationSteps} from "../../../utils/config";
import {ReactComponent as UploadIcon} from "../../../assets/upload-icon.svg";
import {useNavigate} from "react-router-dom";

function UploadButton({ displayMessage }: {displayMessage: string}) {
    const navigate = useNavigate();
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
                cursor: 'pointer',
                textAlign: 'center'
            }}
            htmlFor={"upload-qr"}
            onClick={(event) => {
                if (!window.navigator.onLine) {
                    event.preventDefault();
                    navigate('/offline');
                }
            }}
        >
            <span style={{
                margin: "auto",
                display: 'flex',
                placeContent: 'center',
                width: '100%'
            }}>
                <span style={{display: "inline-grid", marginRight: "6px"}}>
                    <UploadIcon/>
                </span>
                <span style={{display: "inline-grid"}}>
                    {displayMessage}
                </span>
            </span>
        </label>
    );
}

export const UploadQrCode = ({setScanResult, displayMessage, setScanStatus}:
                                 {
                                     setScanResult: SetScanResultFunction,
                                     displayMessage: string,
                                       setScanStatus: (status: ScanStatus) => void
                                   }) => {
    const {setActiveStep} = useActiveStepContext();
    const {setAlertInfo} = useAlertMessages();
    return (
        <div style={{margin: "6px auto", display: "flex", placeContent: "center", width: "350px"}}>
            <UploadButton displayMessage={displayMessage}/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg, .jpg"
                style={{
                    margin: "8px auto",
                    display: "none",
                    height: 0
                }}
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;
                    if (file.size < UploadFileSizeLimits.min || file.size > UploadFileSizeLimits.max) {
                        console.log(`File size: `, file?.size);
                        setActiveStep(VerificationSteps.ScanQrCodePrompt);
                        setAlertInfo({...AlertMessages.unsupportedFileSize, open: true});
                        setScanStatus("Failed");
                        return;
                    }
                    setActiveStep(VerificationSteps.Verifying);
                    scanFilesForQr(file)
                        .then(scanResult => {
                            setScanStatus(!!scanResult.data ? "Success" : "Failed")
                            setScanResult(scanResult);
                        });
                }}
            />
        </div>);
}
