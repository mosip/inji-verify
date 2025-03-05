import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch} from "../redux/hooks";
import {raiseAlert} from "../redux/features/alerts/alerts.slice";
import {AlertMessages, Pages} from "../utils/config";

function PageNotFound404(props: any) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate(Pages.Scan, { replace: true });
            return;
          }
        navigate(Pages.Home);
        dispatch(raiseAlert({...AlertMessages().pageNotFound}));
    }, [navigate, dispatch, location.pathname]);

    return (
        <></>
    );
}

export default PageNotFound404;