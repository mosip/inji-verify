import React, {useEffect} from 'react';
import {Alert, Snackbar} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {raiseAlert} from "../../redux/features/verificationSlice";

const AlertMessage = () => {
    const alertInfo = useAppSelector(state => {
        console.log("State alert: ", state.alert);
        return state.alert ?? {}
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("Alert updated: ", alertInfo)
    }, [alertInfo]);

    const handleClose = () => dispatch(raiseAlert({alert: {...alertInfo, open: false}}));

    return (
        <Snackbar
            open={alertInfo.open}
            autoHideDuration={alertInfo.autoHideDuration ?? 4000}
            onClose={handleClose}
            message={alertInfo.message}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
        >
            <Alert
                onClose={handleClose}
                severity={alertInfo.severity}
                variant="filled"
                sx={{ width: '100%' }}
                style={{
                    borderRadius: '10px',
                    padding: '16px 18px'
                }}
            >
                {alertInfo.message}
            </Alert>
        </Snackbar>
    );
}

export default AlertMessage;