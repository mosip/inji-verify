import React, {useEffect} from 'react';
import LoaderWithBackdrop from "../commons/LoaderWithBackdrop";
import {useApplicationStateSelector} from "../../redux/features/application-state/application-state.selector";
import {useNavigate} from "react-router-dom";

function CheckingForInternetConnectivity(props: any) {
    const internetStatus = useApplicationStateSelector(state => state.internetConnectionStatus);
    const navigate = useNavigate();
    useEffect(() => {
        if (internetStatus === "OFFLINE") {
            navigate("/offline");
        }
    }, [internetStatus]);
    return internetStatus === "LOADING" ? (
        <LoaderWithBackdrop/>
    ) : <></>;
}

export default CheckingForInternetConnectivity;
