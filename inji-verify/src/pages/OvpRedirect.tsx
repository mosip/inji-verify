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
        let vpToken, presentationSubmission, params, error, errorDescription;
        try {
            params = new URLSearchParams(location.hash.substring(1));
            const queryParams = new URLSearchParams(location.search.substring(1));

            vpToken = !!params.get("vp_token")
                ? JSON.parse(atob(params.get("vp_token") as string)) // base64 encoded
                : undefined;
            presentationSubmission = !!params.get("presentation_submission")
                ? decodeURIComponent(params.get("presentation_submission") as string) // url encoded
                : undefined;

            error = queryParams.get("error");
            errorDescription = queryParams.get("error_description");
        }
        catch (error) {
            console.error("Error occurred while reading params in redirect url, Error: ", error);
        }
        finally {
            navigate(Pages.Home, { replace: true });
            if (!!vpToken && !!presentationSubmission) {
                dispatch(verificationInit({ovp: {vpToken, presentationSubmission}}));
            } else if (!!error) {
                dispatch(raiseAlert(
                    {
                        message: OvpErrors[error]
                            ?? errorDescription
                            ?? "Something Went Wrong!!",
                        severity: "error"
                    }));
            } else {
                dispatch(raiseAlert({message: "Invalid Parameters!!", severity: "error"}))
            }
        }
    }, [location, navigate, dispatch]);
    return (
        <PageTemplate/>
    );
}

export default OvpRedirect;
