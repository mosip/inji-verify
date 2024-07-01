import {scanFilesForQr} from "../../../utils/qr-utils";
import {AlertMessages, SupportedFileTypes, UploadFileSizeLimits} from "../../../utils/config";
import {ReactComponent as UploadIcon} from "../../../assets/upload-icon.svg";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, qrReadInit, verificationInit} from "../../../redux/features/verification/verification.slice";
import {raiseAlert} from "../../../redux/features/alerts/alerts.slice";
import {checkInternetStatus, getFileExtension} from "../../../utils/misc";
import {updateInternetConnectionStatus} from "../../../redux/features/application-state/application-state.slice";
import {AlertInfo} from "../../../types/data-types";

const doFileChecks = (file: File): AlertInfo | null => {
    // file format check
    const fileExtension = getFileExtension(file.name);
    if (!SupportedFileTypes.includes(fileExtension)) {
        return AlertMessages.unsupportedFileType;
    }

    // file size check
    if (file.size < UploadFileSizeLimits.min || file.size > UploadFileSizeLimits.max) {
        return AlertMessages.unsupportedFileSize;
    }

    return null;
}

const acceptedFileTypes = SupportedFileTypes.map(ext => `.${ext}`).join(', ')

function UploadButton({ displayMessage }: {displayMessage: string}) {
    const dispatch = useAppDispatch();
    return (
        <label
            className="hover:bg-primary bg-[#FFFFFF] hover:text-[#FFFFFF] text-primary bg-no-repeat rounded-[9999px] border-2 border-primary font-bold w-[350px] cursor-pointer text-center px-0 py-[12px] text-[16px] fill-[#ff7f00] hover:fill-white"
            htmlFor={"upload-qr"}
            onClick={async (event) => {
                dispatch(updateInternetConnectionStatus({internetConnectionStatus: "LOADING"}));
                event.stopPropagation();
                event.preventDefault();
                let isOnline = await checkInternetStatus();
                dispatch(updateInternetConnectionStatus({internetConnectionStatus: isOnline ? "ONLINE" : "OFFLINE"}));
                if (isOnline) document.getElementById("upload-qr")?.click();
            }}
        >
            <span className="flex m-auto content-center justify-center w-[100%]">
                <span className="inline-grid mr-1.5">
                    <UploadIcon className="fill-inherit"/>
                </span>
                <span id="upload-qr-code-button" className="inline-grid">
                    {displayMessage}
                </span>
            </span>
        </label>
    );
}

export const UploadQrCode = ({displayMessage, className}: { displayMessage: string, className?: string }) => {
    const dispatch = useAppDispatch();
    return (
        <div className={`mx-auto my-1.5 flex content-center justify-center ${className}`}>
            <UploadButton displayMessage={displayMessage}/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept={acceptedFileTypes}
                className="mx-auto my-2 hidden h-0"
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;
                    const alert = doFileChecks(file);
                    if (alert) {
                        dispatch(goHomeScreen({}));
                        dispatch(raiseAlert({...alert, open: true}))
                        if (e?.target)
                            e.target.value = ""; // clear the target to be able to read same file again
                        return;
                    }
                    dispatch(qrReadInit({method: "UPLOAD"}));
                    scanFilesForQr(file)
                        .then(scanResult => {
                            if (scanResult.error) console.error(scanResult.error);
                            if (!!scanResult.data) {
                                dispatch(raiseAlert({...AlertMessages.qrUploadSuccess, open: true}));
                                dispatch(verificationInit({qrReadResult: {qrData: scanResult.data, status: "SUCCESS"}}));
                            } else {
                                dispatch(raiseAlert({...AlertMessages.qrNotDetected, open: true}));
                                dispatch(goHomeScreen({}));
                            }
                        });
                }}
            />
        </div>);
}
