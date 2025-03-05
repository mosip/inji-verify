import React, { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Offline from "./pages/Offline";
import { Scan } from "./pages/Scan";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AlertMessage from "./components/commons/AlertMessage";
import PreloadImages from "./components/commons/PreloadImages";
import OvpRedirect from "./pages/OvpRedirect";
import PageNotFound404 from "./pages/PageNotFound404";
import { Pages } from "./utils/config";
import { useAppSelector } from "./redux/hooks";
import store, { RootState } from "./redux/store";
import { isRTL } from "./utils/i18n";
import { VerificationMethod } from "./types/data-types";
import { goToHomeScreen } from "./redux/features/verification/verification.slice";

function switchToVerificationMethod(method: VerificationMethod) {
  store.dispatch(goToHomeScreen({ method }));
  return null;
}

const router = createBrowserRouter([
  {
    path: Pages.Home,
    element: <Home />,
    loader: () => switchToVerificationMethod("UPLOAD"),
  },
  {
    path: Pages.Scan,
    element: <Scan />,
    loader: () => switchToVerificationMethod("SCAN"),
  },
  {
    path: Pages.Redirect,
    element: <OvpRedirect />,
  },
  {
    path: Pages.Offline,
    element: <Offline />,
  },
  {
    path: Pages.PageNotFound,
    element: <PageNotFound404 />,
  },
]);

const preloadImages = ['/assets/images/under_construction.svg', '/assets/images/inji-logo.svg'];

function App() {
    const language = useAppSelector((state: RootState) => state.common.language);
    const rtl = isRTL(language)

    useEffect(() => {
        document.body.classList.toggle('rtl', rtl);
    }, [rtl]);
    
  return (
    <div className="font-base">
      <RouterProvider router={router} />
      <AlertMessage isRtl={rtl}  />
      <PreloadImages imageUrls={preloadImages} />
    </div>
  );
}

export default App;
