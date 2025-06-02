import { Dispatch } from "redux";
import { checkInternetStatus, getFileExtension } from "./misc";
import { AlertMessages, SupportedFileTypes, UploadFileSizeLimits } from "./config";
import { raiseAlert } from "../redux/features/alerts/alerts.slice";
import { goToHomeScreen } from "../redux/features/verification/verification.slice";
import { updateInternetConnectionStatus } from "../redux/features/application-state/application-state.slice";
import { AlertInfo } from "../types/data-types";

export const acceptedFileTypes = SupportedFileTypes.map((ext) => `.${ext}`).join(", ");


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

