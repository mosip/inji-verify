import {combineReducers, configureStore} from "@reduxjs/toolkit";
import verificationFlowReducer from './features/verification/verification.slice';
import alertsReducer from "./features/alerts/alerts.slice";
import applicationStateReducer from "./features/application-state/application-state.slice";
import vpVerificationReducer from "./features/verify/vpVerificationState"
import verificationSaga from './features/verification/verification.saga';
import createSagaMiddleware from "redux-saga";
import commonReducer from './features/common/commonSlice'
import verifySaga from "./features/verify/verifySaga";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    verification: verificationFlowReducer,
    alert: alertsReducer,
    appState: applicationStateReducer,
    common:commonReducer,
    verify: vpVerificationReducer
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
sagaMiddleware.run(verifySaga);


export default store;
