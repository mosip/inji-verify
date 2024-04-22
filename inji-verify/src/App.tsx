import React, {useEffect} from 'react';
import './App.css';
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import {RouterProvider, createBrowserRouter} from "react-router-dom";

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
        <>
            <RouterProvider router={router}/>
            <PreloadImages imageUrls={preloadImages}/>
        </>
    );
}

export default App;
