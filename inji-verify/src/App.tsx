import React from 'react';
import logo from './assets/logo.svg';
import './App.css';
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AlertMessage from "./components/commons/AlertMessage";
import {AlertInfo} from "./types/data-types";
import {useAppSelector} from "./redux/hooks";

import PreloadImages from "./components/commons/PreloadImages";

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

const preloadImages = ['/assets/images/under_construction.svg', '/assets/images/inji-logo.svg'];

function App() {
    return (
        <div>
            <RouterProvider router={router}/>
            <AlertMessage/>
            <PreloadImages imageUrls={preloadImages}/>
        </div>
    );
}

export default App;
