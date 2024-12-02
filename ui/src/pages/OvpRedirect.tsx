import React, {useEffect} from 'react';
import PageTemplate from "../components/PageTemplate";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch} from "../redux/hooks";
import {verificationInit} from "../redux/features/verification/verification.slice";
import {raiseAlert} from "../redux/features/alerts/alerts.slice";
import {OvpErrors, Pages} from "../utils/config";

function OvpRedirect(props: any) {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    useEffect(() => {
        let vpToken, presentationSubmission, error;
        try {
            const params = new URLSearchParams(location.hash.substring(1));
            const queryParams = new URLSearchParams(location.search.substring(1));

            vpToken = !!params.get("vp_token")
                ? JSON.parse(atob(params.get("vp_token") as string)) // base64 encoded
                : undefined;
            presentationSubmission = !!params.get("presentation_submission")
                ? decodeURIComponent(params.get("presentation_submission") as string) // url encoded
                : undefined;

            error = queryParams.get("error");
        }
        catch (error) {
            console.error("Error occurred while reading params in redirect url, Error: ", error);
        }
        finally {
            navigate(Pages.Home, { replace: true });
            if (!!vpToken && !!presentationSubmission) {
                dispatch(verificationInit({ovp: {vpToken, presentationSubmission}}));
            } else if (!!error) {
                const OvpErrorMessages = OvpErrors();
                dispatch(raiseAlert({message: OvpErrorMessages.error ?? OvpErrorMessages[error] ?? OvpErrorMessages.resource_not_found, severity: "error"}));
            } else {
                const OvpErrorMessages = OvpErrors();
                dispatch(raiseAlert({message: OvpErrorMessages.invalid_params, severity: "error"}))
            }
        }
    }, [location, navigate, dispatch]);
    return (
        <PageTemplate/>
    );
}

export default OvpRedirect;
