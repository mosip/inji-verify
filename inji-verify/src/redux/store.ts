import {configureStore} from "@reduxjs/toolkit";
import {PreloadedState, rootReducer} from './reducer';
import {thunk} from "redux-thunk";

const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
        devTools: true/*process.env.NODE_ENV !== 'production'*/,
        preloadedState: PreloadedState as any
    }
);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
