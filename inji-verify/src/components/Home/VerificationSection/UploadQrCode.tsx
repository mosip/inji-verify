import {scanFilesForQr} from "../../../utils/qr-utils";
import {AlertMessages, SupportedFileTypes, UploadFileSizeLimits} from "../../../utils/config";
import {ReactComponent as UploadIcon} from "../../../assets/upload-icon.svg";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, qrReadInit, verificationInit} from "../../../redux/features/verification/verification.slice";
import {raiseAlert} from "../../../redux/features/alerts/alerts.slice";
import {checkInternetStatus, getFileExtension} from "../../../utils/misc";
import {updateInternetConnectionStatus} from "../../../redux/features/application-state/application-state.slice";
import {AlertInfo} from "../../../types/data-types";
import {Dispatch} from "redux";
import { useTranslation } from "react-i18next";

const doFileChecks = (dispatch: Dispatch, file: File | null): boolean => {
    if (!file) return false;
    let alert: AlertInfo | null = null;
    // file format check
    const fileExtension = getFileExtension(file.name).toLowerCase();
    if (!SupportedFileTypes.includes(fileExtension)) {
        alert = AlertMessages.unsupportedFileType;
    }

    // file size check
    if (file.size < UploadFileSizeLimits.min || file.size > UploadFileSizeLimits.max) {
        alert = AlertMessages.unsupportedFileSize;
    }

    if (alert) {
        dispatch(goHomeScreen({}));
        dispatch(raiseAlert({...alert, open: true}))
        return false;
    }
    return true;
}

const doInternetCheck = async (dispatch: Dispatch) => {
    dispatch(updateInternetConnectionStatus({internetConnectionStatus: "LOADING"}));
    let isOnline = await checkInternetStatus();
    dispatch(updateInternetConnectionStatus({internetConnectionStatus: isOnline ? "ONLINE" : "OFFLINE"}));
    return isOnline;
}

const acceptedFileTypes = SupportedFileTypes.map(ext => `.${ext}`).join(', ')

function UploadButton({ displayMessage }: {displayMessage: string}) {
    return (
        <label
            className="hover:bg-[#7F56D9] bg-[#FFFFFF] hover:text-[#FFFFFF] text-[#7F56D9] bg-no-repeat !rounded-xl border-2 border-[#7F56D9] font-bold w-[350px] cursor-pointer text-center px-0 py-[12px] text-[16px] fill-[#7F56D9] hover:fill-white"
            htmlFor={"upload-qr"}
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

export const UploadQrCode = ({className}: { className?: string }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("upload_qr_code");
    return (
        <div className={`mx-auto my-1.5 flex content-center justify-center ${className}`}>
            <UploadButton displayMessage={t("upload")}/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept={acceptedFileTypes}
                className="mx-auto my-2 hidden h-0"
                onChange={async (e) => {
                    const isOnline = await doInternetCheck(dispatch);
                    if (!isOnline) return;

                    const file = e?.target?.files && e?.target?.files[0];
                    const fileChecksPassed = doFileChecks(dispatch, file);
                    if (!fileChecksPassed) {
                        if (e?.target)
                            e.target.value = ""; // clear the target to be able to read same file again
                        return;
                    }

                    scanFilesForQr(file)
                        .then(scanResult => {
                            if (scanResult.error) console.error(scanResult.error);
                            if (!!scanResult.data) {
                                dispatch(qrReadInit({method: "UPLOAD"}));
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
