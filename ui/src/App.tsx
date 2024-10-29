import React from "react";
import "./App.css";
import { Pages } from "./utils/config";
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import Scan from "./pages/Scan";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AlertMessage from "./components/commons/AlertMessage";
import PreloadImages from "./components/commons/PreloadImages";
import OvpRedirect from "./pages/OvpRedirect";
import PageNotFound404 from "./pages/PageNotFound404";
import { Verify } from "./pages/Verify";
import { goToHomeScreen } from "./redux/features/verification/verification.slice";
import { VerificationMethod } from "./types/data-types";
import store from "./redux/store";

function switchToVerificationMethod(method: VerificationMethod) {
  store.dispatch(goToHomeScreen({ method }));
  return null;
}

const router = createBrowserRouter([
  {
    path: Pages.Home, // e.g., "/"
    element: <Home />,
    loader: () => switchToVerificationMethod("UPLOAD"),
  },
  {
    path: Pages.Scan, // e.g., "/scan"
    element: <Scan />,
    loader: () => switchToVerificationMethod("SCAN"),
  },
  {
    path: Pages.VerifyCredentials, // e.g., "/verify"
    element: <Verify />,
    loader: () => switchToVerificationMethod("VERIFY"),
  },
  {
    path: Pages.Redirect, // e.g., "/ovp-redirect"
    element: <OvpRedirect />,
  },
  {
    path: Pages.Offline, // e.g., "/offline"
    element: <Offline />,
  },
  {
    path: Pages.PageNotFound, // e.g., "*"
    element: <PageNotFound404 />,
  },
]);

const preloadImages = [
  "/assets/images/under_construction.svg",
  "/assets/images/inji-logo.svg",
];

function App() {
  return (
    <div className="font-base">
      <RouterProvider router={router} />
      <AlertMessage />
      <PreloadImages imageUrls={preloadImages} />
    </div>
  );
}

export default App;
