import {configureStore} from "@reduxjs/toolkit";
import verificationFlowReducer, {PreloadedState} from './features/verification/verificationSlice';
import verificationSaga from './features/verification/verificationSaga';
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
        reducer: verificationFlowReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
        devTools: true/*process.env.NODE_ENV !== 'production'*/,
        preloadedState: PreloadedState as any
    }
);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// Run the saga
sagaMiddleware.run(verificationSaga);

export default store;
