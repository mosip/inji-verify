import React, {useEffect} from 'react';
import {useAppDispatch} from "../../redux/hooks";
import {closeAlert} from "../../redux/features/alerts/alerts.slice";
import {ReactComponent as CloseIcon} from "../../assets/close_icon.svg";
import {useAlertsSelector} from "../../redux/features/alerts/alerts.selector";

const AlertMessage = () => {
    const alertInfo = useAlertsSelector();
    const dispatch = useAppDispatch();

    const handleClose = () => dispatch(closeAlert({}));

    useEffect(() => {
        if (alertInfo.open) {
            const timer = setTimeout(() => {
                dispatch(closeAlert({}))
            }, alertInfo.autoHideDuration ?? 3500);
            return () => clearTimeout(timer);
        }
    }, [alertInfo, dispatch]);

    return (
        <>
            <div
                className={`fixed top-[44px] right-[16px] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg ${alertInfo.severity === "success" ? "bg-[#57A04B]" : "bg-[#D73E3E]"} ${alertInfo.open ? "" : "hidden"}`}>
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
