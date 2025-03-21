import React, {useEffect} from 'react';
import {useAppDispatch} from "../../redux/hooks";
import {closeAlert} from "../../redux/features/alerts/alerts.slice";
import { CloseIcon } from '../../utils/theme-utils';
import {useAlertsSelector} from "../../redux/features/alerts/alerts.selector";

const backgroundColorMapping: any = {
    warning: "bg-warningAlert",
    error: "bg-errorAlert",
    success: "bg-successAlert"
}

const AlertMessage = (props:any) => {
    const alertInfo = useAlertsSelector();
    const dispatch = useAppDispatch();
    const {isRtl} = props
    const handleClose = () => dispatch(closeAlert({}));

    useEffect(() => {
        if (alertInfo.open) {
            const timer = setTimeout(() => {
                dispatch(closeAlert({}))
            }, alertInfo.autoHideDuration ?? 5000);
            return () => clearTimeout(timer);
        }
    }, [alertInfo, dispatch]);

    return (
        <>
            <div
                className={`fixed top-[30px] ${isRtl?'left-1 lg:left-[2]':'right-1 lg:right-[2]'} py-[22px] px-[18px] text-white rounded-[12px] shadow-lg ${backgroundColorMapping[alertInfo.severity ?? "success"]} ${alertInfo.open ? "" : "hidden"}`}>
                <div className="flex items-center">
                    <p id="alert-message">
                        {alertInfo.message}
                    </p>
                    <div className={`${isRtl?'pr-4':'pl-4'} cursor-pointer`} onClick={handleClose}>
                        <CloseIcon/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AlertMessage;
