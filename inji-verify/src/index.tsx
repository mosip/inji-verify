import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {encodeData} from "./utils/qr-utils";
import {Provider} from "react-redux";
import store from "./redux/store";
import '../src/utils/i18n'; // Ensure the i18n configuration loads

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

window.encodeData = (data: string) => encodeData(data);

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
