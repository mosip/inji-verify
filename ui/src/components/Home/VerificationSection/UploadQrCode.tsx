import { scanFilesForQr } from "../../../utils/qr-utils";
import {
  AlertMessages,
  SupportedFileTypes,
  UploadFileSizeLimits,
} from "../../../utils/config";
import { GradientUploadIcon, WhiteUploadIcon } from "../../../utils/theme-utils";
import { useAppDispatch } from "../../../redux/hooks";
import {
  goToHomeScreen,
  qrReadInit,
  verificationInit,
} from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import { checkInternetStatus, getFileExtension } from "../../../utils/misc";
import { updateInternetConnectionStatus } from "../../../redux/features/application-state/application-state.slice";
import { AlertInfo } from "../../../types/data-types";
import { Dispatch } from "redux";
import { useState } from "react";

const doFileChecks = (dispatch: Dispatch, file: File | null): boolean => {
  if (!file) return false;
  let alert: AlertInfo | null = null;
  // file format check
  const fileExtension = getFileExtension(file.name).toLowerCase();
  if (!SupportedFileTypes.includes(fileExtension)) {
    alert = AlertMessages.unsupportedFileType;
  }

  // file size check
  if (
    file.size < UploadFileSizeLimits.min ||
    file.size > UploadFileSizeLimits.max
  ) {
    alert = AlertMessages.unsupportedFileSize;
  }

  if (alert) {
    dispatch(goToHomeScreen({}));
    dispatch(raiseAlert({ ...alert, open: true }));
    return false;
  }
  return true;
};

const doInternetCheck = async (dispatch: Dispatch) => {
  dispatch(
    updateInternetConnectionStatus({ internetConnectionStatus: "LOADING" })
  );
  let isOnline = await checkInternetStatus();
  dispatch(
    updateInternetConnectionStatus({
      internetConnectionStatus: isOnline ? "ONLINE" : "OFFLINE",
    })
  );
  return isOnline;
};

const acceptedFileTypes = SupportedFileTypes.map((ext) => `.${ext}`).join(", ");


export const UploadQrCode = ({
  displayMessage,
  className,
}: {
  displayMessage: string;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  
  const [isHover, setHover] = useState(false)

  const UploadButton =({ displayMessage }: { displayMessage: string })=> {
    const UploadIcon = isHover ? WhiteUploadIcon : GradientUploadIcon;
    return (
      <div className="bg-gradient hover:text-white p-px bg-no-repeat rounded-[5px] w-[350px]">
        <label
          htmlFor={"upload-qr"}
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          onTouchStart={()=>setHover(true)}
          className="group bg-white hover:bg-gradient font-bold h-[40px] rounded-[5px] flex content-center justify-center text-lgNormalTextSize pt-2 cursor-pointer"
        >
          <span className="mr-1.5">
            <UploadIcon />
          </span>
          <span id="upload-qr-code-button" className="bg-gradient bg-clip-text text-transparent group-hover:text-white">{displayMessage}</span>
        </label>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto my-1.5 flex content-center justify-center ${className}`}
    >
      <UploadButton displayMessage={displayMessage} />
      <br />
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
            if (e?.target) e.target.value = ""; // clear the target to be able to read same file again
            return;
          }

          scanFilesForQr(file).then((scanResult) => {
            if (scanResult.error) console.error(scanResult.error);
            if (!!scanResult.data) {
              dispatch(qrReadInit({ method: "UPLOAD" }));
              dispatch(
                raiseAlert({ ...AlertMessages.qrUploadSuccess, open: true })
              );
              dispatch(
                verificationInit({
                  qrReadResult: { qrData: scanResult.data, status: "SUCCESS" },
                })
              );
            } else {
              dispatch(
                raiseAlert({ ...AlertMessages.qrNotDetected, open: true })
              );
              dispatch(goToHomeScreen({}));
            }
          });
        }}
      />
    </div>
  );
};
