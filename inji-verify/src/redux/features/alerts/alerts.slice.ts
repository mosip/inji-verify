import {createSlice} from "@reduxjs/toolkit";
import {AlertInfo} from "../../../types/data-types";

export const InitialState: AlertInfo = {}

const alertsSlice = createSlice({
    reducers: {
        raiseAlert: (state, action) => {
            state.open = action.payload.open;
            state.severity = action.payload.severity;
            state.message = action.payload.message;
            state.autoHideDuration = action.payload.autoHideDuration ?? 5000;
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
