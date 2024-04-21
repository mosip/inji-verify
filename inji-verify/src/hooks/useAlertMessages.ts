import {AlertInfo} from "../types/data-types";
import React, {createContext, useContext} from "react";

let alert: AlertInfo = {open: false};
let setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>> = value => {};
export const AlertsContext = createContext({alertInfo: alert, setAlertInfo});
export const useAlertMessages = () => useContext(AlertsContext);
