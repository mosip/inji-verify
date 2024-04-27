import {configureStore} from "@reduxjs/toolkit";
import verificationFlowReducer, {PreloadedState} from './features/verificationSlice';

const store = configureStore({
        reducer: verificationFlowReducer,
        /*middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),*/
        devTools: true/*process.env.NODE_ENV !== 'production'*/,
        preloadedState: PreloadedState as any
    }
);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
