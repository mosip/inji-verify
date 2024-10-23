import {combineReducers, configureStore} from "@reduxjs/toolkit";
import verificationFlowReducer from './features/verification/verification.slice';
import alertsReducer from "./features/alerts/alerts.slice";
import applicationStateReducer from "./features/application-state/application-state.slice";
import verificationSaga from './features/verification/verification.saga';
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    verification: verificationFlowReducer,
    alert: alertsReducer,
    appState: applicationStateReducer
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
