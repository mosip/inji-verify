import React from 'react';
import StyledButton from "../Home/VerificationSection/commons/StyledButton";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../redux/hooks";
import {updateInternetConnectionStatus} from "../../redux/features/application-state/application-state.slice";
import { ReactComponent as UnderConstruction } from "../../assets/images/under-construction.svg";
import { useTranslation } from 'react-i18next';

function SomethingWentWrong(props: any) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {t} = useTranslation('Offline')
    return (
        <div className="grid content-center justify-center rounded-[10px] h-[540px] mx-auto my-7 shadow-lg text-center w-[90%] bg-white bg-no-repeat bg-clip-padding px-6">
            <div className="col-end-13">
            <UnderConstruction className="my-[30px] mx-auto w-[372px] max-w-[90%]" />
            </div>
            <div className="col-end-13">
                <h6 id="no-internet-connection" className="font-medium text-offlineLabel text-lgMediumTextSize mx-auto my-[5px]">
                    {t('header')}
                </h6>
                <p id="no-internet-description" className="font-normal text-offlineDescription text-normalTextSize mx-auto my-[5px]">
                    {t('description')}
                </p>
                <StyledButton
                    id="please-try-again-button"
                    className="my-[30px] mx-auto"
                    onClick={() => {
                        dispatch(updateInternetConnectionStatus({internetConnectionStatus: "UNKNOWN"}));
                        navigate('/');
                    }}
                >
                    {t('retry')}
                </StyledButton>
            </div>
        </div>
    );
}

export default SomethingWentWrong;
