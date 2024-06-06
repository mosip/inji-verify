import React, {useEffect} from 'react';
import LoaderWithBackdrop from "../commons/LoaderWithBackdrop";
import {useApplicationStateSelector} from "../../redux/features/application-state/application-state.selector";
import {navigateToOffline} from "../../utils/misc";

function CheckingForInternetConnectivity(props: any) {
    const internetStatus = useApplicationStateSelector(state => state.internetConnectionStatus);
    useEffect(() => {
        if (internetStatus === "OFFLINE") {
            navigateToOffline();
        }
    }, [internetStatus]);
    return internetStatus === "LOADING" ? (
        <LoaderWithBackdrop/>
    ) : <></>;
}

export default CheckingForInternetConnectivity;
