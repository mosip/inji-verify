import {createSlice} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../types/data-types";

export const PreloadedState: ApplicationState = {
    online: true
};

const appStateSlice = createSlice({
    reducers: {
        updateInternetConnectionStatus: (state, action) => {
            state.online = action.payload.online;
        },
    },
    name: "AppState",
    initialState: PreloadedState
})

export const {
    updateInternetConnectionStatus
} = appStateSlice.actions;

export default appStateSlice.reducer;
