import React from 'react';
import './App.css';
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AlertMessage from "./components/commons/AlertMessage";

import PreloadImages from "./components/commons/PreloadImages";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/redirect',
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
        <div className="font-base">
            <RouterProvider router={router}/>
            <AlertMessage/>
            <PreloadImages imageUrls={preloadImages}/>
        </div>
    );
}

export default App;
