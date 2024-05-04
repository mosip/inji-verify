import {scanFilesForQr} from "../../../utils/qr-utils";
import {AlertMessages, UploadFileSizeLimits} from "../../../utils/config";
import {ReactComponent as UploadIcon} from "../../../assets/upload-icon.svg";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, qrReadInit, raiseAlert, verificationInit} from "../../../redux/features/verificationSlice";

function UploadButton({ displayMessage }: {displayMessage: string}) {
    return (
        <label
            className="bg-[#FFFFFF] bg-no-repeat rounded-[9999px] border-2 border-[#FF7F00] font-bold text-[#FF7F00] w-[350px] cursor-pointer text-center px-0 py-[18px]"
            htmlFor={"upload-qr"}
        >
            <span className="flex m-auto content-center justify-center w-[100%]">
                <span className="inline-grid mr-1.5">
                    <UploadIcon/>
                </span>
                <span className="inline-grid">
                    {displayMessage}
                </span>
            </span>
        </label>
    );
}

export const UploadQrCode = ({displayMessage}: { displayMessage: string }) => {
    const dispatch = useAppDispatch();
    return (
        <div className="mx-auto my-1.5 flex content-center justify-center w-[350px]">
            <UploadButton displayMessage={displayMessage}/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg, .jpg, .pdf"
                className="mx-auto my-2 hidden h-0"
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;
                    if (file.size < UploadFileSizeLimits.min || file.size > UploadFileSizeLimits.max) {
                        console.log(`File size: `, file?.size);
                        dispatch(goHomeScreen({}));
                        dispatch(raiseAlert({alert: {...AlertMessages.unsupportedFileSize, open: true}}))
                        return;
                    }
                    dispatch(qrReadInit({flow: "UPLOAD"}));
                    scanFilesForQr(file)
                        .then(scanResult => {
                            if (scanResult.error) console.error(scanResult.error);
                            if (!!scanResult.data) {
                                dispatch(raiseAlert({alert: {...AlertMessages.qrUploadSuccess, open: true}}));
                                dispatch(verificationInit({qrReadResult: {qrData: scanResult.data, status: "SUCCESS"}}));
                            } else {
                                dispatch(raiseAlert({alert: {...AlertMessages.qrNotDetected, open: true}}));
                                dispatch(goHomeScreen({}));
                            }
                        });
                }}
            />
        </div>);
}
