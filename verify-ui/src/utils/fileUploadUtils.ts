import { Dispatch } from "redux";
import { scanFilesForQr } from "./qr-utils";
import { checkInternetStatus, getFileExtension } from "./misc";
import { AlertMessages, SupportedFileTypes, UploadFileSizeLimits } from "./config";
import { raiseAlert } from "../redux/features/alerts/alerts.slice";
import { goToHomeScreen, qrReadInit, verificationInit } from "../redux/features/verification/verification.slice";
import { updateInternetConnectionStatus } from "../redux/features/application-state/application-state.slice";
import { AlertInfo } from "../types/data-types";

export const acceptedFileTypes = SupportedFileTypes.map((ext) => `.${ext}`).join(", ");

const doFileChecks = (dispatch: Dispatch, file: File | null): boolean => {
  if (!file) return false;
  let alert: AlertInfo | null = null;
  // file format check
  const fileExtension = getFileExtension(file.name).toLowerCase();
  if (!SupportedFileTypes.includes(fileExtension)) {
    alert = AlertMessages().unsupportedFileType;
  }

  // file size check
  if (
    file.size < UploadFileSizeLimits.min ||
    file.size > UploadFileSizeLimits.max
  ) {
    alert = AlertMessages().unsupportedFileSize;
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

export const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch
) => {
  const isOnline = await doInternetCheck(dispatch);
  if (!isOnline) return;

  const file = e.target.files?.[0];
  if (!file) return;

  const fileChecksPassed = doFileChecks(dispatch, file);
  if (!fileChecksPassed) {
    e.target.value = "";
    return;
  }

  scanFilesForQr(file).then((scanResult) => {
    if (scanResult.error) console.error(scanResult.error);

    if (scanResult.data) {
      dispatch(qrReadInit({ method: "UPLOAD" }));
      dispatch(raiseAlert({ ...AlertMessages().qrUploadSuccess, open: true }));
      dispatch(
        verificationInit({
          qrReadResult: { qrData: scanResult.data, status: "SUCCESS" },
        })
      );
    } else {
      dispatch(raiseAlert({ ...AlertMessages().qrNotDetected, open: true }));
      dispatch(goToHomeScreen({}));
    }
  });

  e.target.value = "";
};
