import {createSlice} from "@reduxjs/toolkit";
import {AlertInfo} from "../../../types/data-types";
import {DisplayTimeout} from "../../../utils/config";

export const InitialState: AlertInfo = {}

const alertsSlice = createSlice({
    reducers: {
        raiseAlert: (state, action) => {
            state.open = true;
            state.severity = action.payload.severity;
            state.message = action.payload.message;
            state.autoHideDuration = action.payload.autoHideDuration ?? DisplayTimeout;
        },
        closeAlert: (state, action) => {
            state.open = false;
        }
    },
    initialState: InitialState,
    name: "Alerts"
});

export const {raiseAlert, closeAlert} = alertsSlice.actions;

export default alertsSlice.reducer;
