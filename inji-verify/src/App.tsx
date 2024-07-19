import React from 'react';
import './App.css';
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import AlertMessage from "./components/commons/AlertMessage";

import PreloadImages from "./components/commons/PreloadImages";
import OvpRedirect from "./pages/OvpRedirect";
import PageNotFound404 from "./pages/PageNotFound404";
import {Pages} from "./utils/config";

const router = createBrowserRouter([
    {
        path: Pages.Home,
        element: <Home/>
    },
    {
        path: Pages.Redirect,
        element: <OvpRedirect/>
    },
    {
        path: Pages.Offline,
        element: <Offline/>
    },
    {
        path: Pages.PageNotFound,
        element: <PageNotFound404/>
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
