import React, {useEffect} from 'react';
import {useAppDispatch} from "../../redux/hooks";
import {updateInternetConnectionStatus} from "../../redux/features/app-state/app-state.slice";

const makeAnApiCall = async (): Promise<boolean> => {
    try {
        // Try making an api call if the window.navigator.onLine is true
        await fetch('https://dns.google',
            {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            }); // Use a reliable external endpoint
        return true;
    } catch (error) {
        return false; // Network request failed, assume offline
    }
}

function OnlineStatus() {
    const dispatch = useAppDispatch();
    function setInternetConnectivityStatus(online: boolean) {
        dispatch(updateInternetConnectionStatus({online}))
    }

    useEffect(() => {
        const checkOnlineStatus = async () => {
            // According to docs here: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine,
            // the onLine variable can give false positives, meaning it could say the browser is online occasionally even if it is offline
            // so additional means of checking the internet connectivity is required
            if (!window.navigator.onLine) {
                setInternetConnectivityStatus(false);
                return;
            }
            const status = await makeAnApiCall();
            setInternetConnectivityStatus(status);
        };

        window.addEventListener('online', checkOnlineStatus);
        window.addEventListener('offline', checkOnlineStatus);

        const intervalId = setInterval(checkOnlineStatus, 5000); // Check online status periodically

        checkOnlineStatus(); // Check online status immediately

        return () => {
            clearInterval(intervalId); // Clean up interval
            window.removeEventListener('online', checkOnlineStatus);
            window.removeEventListener('offline', checkOnlineStatus);
        };
    }, []);
    return (
        <></>
    );
}

export default OnlineStatus;
