import { createSlice } from "@reduxjs/toolkit";

const PreloadedState = {
  isLoading: false,
  requestUri: "",
};

const verifyState = createSlice({
  name: "vpVerification",
  initialState: PreloadedState,
  reducers: {
    getRequestUri: (state) => {
      state.isLoading = true;
    },
    setRequestUri: (state, action) => {
      state.requestUri = action.payload;
      state.isLoading = false;
    },
    
  },
});

export const { getRequestUri, setRequestUri } = verifyState.actions;

export default verifyState.reducer;
