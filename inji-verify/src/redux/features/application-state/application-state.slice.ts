import {createSlice} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../types/data-types";

export const PreloadedState: ApplicationState = {
    internetConnectionStatus: "ONLINE"
};

const applicationStateSlice = createSlice({
    reducers: {
        updateInternetConnectionStatus: (state, action) => {
            state.internetConnectionStatus = action.payload.internetConnectionStatus;
        }
    },
    name: "ApplicationState",
    initialState: PreloadedState
})

export const {
    updateInternetConnectionStatus
} = applicationStateSlice.actions;

export default applicationStateSlice.reducer;
