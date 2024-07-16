import React, {useEffect} from 'react';
import PageTemplate from "../components/PageTemplate";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch} from "../redux/hooks";
import {verificationInit} from "../redux/features/verification/verification.slice";

const extractParam = (params: URLSearchParams, paramName: string) => {
    const encodedValue = params.get(paramName);
    return (!!encodedValue)
        ? JSON.parse(atob(encodedValue))
        : null;
}

function OvpRedirect(props: any) {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    useEffect(() => {
        let vpToken, presentationSubmission;
        try {
            const params = new URLSearchParams(location.hash.substring(1));

            vpToken = extractParam(params, "vp_token");
            presentationSubmission = extractParam(params, "presentation_submission");
        }
        catch (error) {
            console.error("Error occurred while reading params in redirect url, Error: ", error);
        }
        finally {
            navigate("/");
            if (!!vpToken && !!presentationSubmission) {
                dispatch(verificationInit({ovp: {vpToken, presentationSubmission}}));
            }
        }
    }, [location, navigate, dispatch]);
    return (
        <PageTemplate/>
    );
}

export default OvpRedirect;
