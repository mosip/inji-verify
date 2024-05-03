import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {raiseAlert} from "../../redux/features/verificationSlice";
import {ReactComponent as CloseIcon} from "../../assets/close_icon.svg";

const severityColorMapping = {
    "success": "bg-[#57A04B]",
    "info": "bg-[#03a9f4]",
    "warning": "bg-[#ff9800]",
    "error": "bg-[#D73E3E]"
}

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
        <>
            <div
                className={`fixed top-[44px] right-[16px] py-[22px] px-[18px] text-white rounded-[12px] ${alertInfo.severity === "success" ? "bg-[#57A04B]" : "bg-[#D73E3E]"} ${alertInfo.open ? "" : "hidden"}`}>
                <div className="flex items-center">
                    <p>
                        {alertInfo.message}
                    </p>
                    <div className="pl-4 cursor-pointer" onClick={handleClose}>
                        <CloseIcon/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AlertMessage;