import {scanFilesForQr} from "../../../utils/qr-utils";
import {AlertMessages, UploadFileSizeLimits} from "../../../utils/config";
import {ReactComponent as UploadIcon} from "../../../assets/upload-icon.svg";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, raiseAlert, verificationInit} from "../../../redux/features/verificationSlice";

function UploadButton({ displayMessage }: {displayMessage: string}) {
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

export const UploadQrCode = ({displayMessage}: { displayMessage: string }) => {
    const dispatch = useAppDispatch();
    return (
        <div style={{margin: "6px auto", display: "flex", placeContent: "center", width: "350px"}}>
            <UploadButton displayMessage={displayMessage}/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg, .jpg, .pdf"
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
                        dispatch(goHomeScreen({}));
                        dispatch(raiseAlert({
                            alert: {
                                ...AlertMessages.unsupportedFileSize, open: true
                            }
                        }))
                        return;
                    }
                    scanFilesForQr(file)
                        .then(scanResult => {
                            if (scanResult.error) console.error(scanResult.error);
                            let alertInfo = !!scanResult.data ? AlertMessages.qrUploadSuccess: AlertMessages.qrNotDetected;
                            dispatch(raiseAlert({
                                alert: {
                                    ...alertInfo,
                                    open: true
                                }
                            }));
                            dispatch(verificationInit({qrReadResult: {qrData: scanResult.data, status: !!scanResult.data ? "SUCCESS" : "FAILED"}}));
                        });
                }}
            />
        </div>);
}
