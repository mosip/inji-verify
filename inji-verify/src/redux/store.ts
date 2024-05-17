import {combineReducers, configureStore} from "@reduxjs/toolkit";
import verificationFlowReducer, {PreloadedState} from './features/verification/verification.slice';
import alertsReducer, {InitialState as alertsState} from "./features/alerts/alerts.slice";
import verificationSaga from './features/verification/verification.saga';
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    verification: verificationFlowReducer,
    alert: alertsReducer
});

const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
        devTools: true/*process.env.NODE_ENV !== 'production'*/
    }
);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// Run the saga
sagaMiddleware.run(verificationSaga);

export default store;
