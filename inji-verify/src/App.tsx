import React, {useState} from 'react';
import logo from './assets/logo.svg';
import './App.css';
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AlertMessage from "./components/commons/AlertMessage";
import {AlertInfo} from "./types/data-types";
import {useAppSelector} from "./redux/hooks";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/offline',
        element: <Offline/>
    }
])

function App() {
    return (
        <div>
            <RouterProvider router={router}/>
            <AlertMessage/>
        </div>
    );
}

export default App;
