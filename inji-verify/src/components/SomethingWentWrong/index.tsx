import React from 'react';
import StyledButton from "../Home/VerificationSection/commons/StyledButton";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../redux/hooks";
import {updateInternetConnectionStatus} from "../../redux/features/application-state/application-state.slice";
import { ReactComponent as UnderConstruction } from "../../assets/images/under-construction.svg";

function SomethingWentWrong(props: any) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    return (
        <div className="grid content-center justify-center rounded-[10px] h-[540px] mx-auto my-7 shadow-lg text-center w-[90%] bg-white bg-no-repeat bg-clip-padding px-6">
            <div className="col-end-13">
            <UnderConstruction className="my-[30px] mx-auto w-[372px] max-w-[90%]" />
            </div>
            <div className="col-end-13">
                <h6 id="no-internet-connection" className="font-medium text-2xl  text-[#2C2C2C] mx-auto my-[5px]">
                    No Internet Connection!
                </h6>
                <p id="no-internet-description" className="font-normal text-[14px]  text-[#7B7B7B] mx-auto my-[5px]">
                    Oops! We can’t seem to connect. Check your internet connection and try again.
                </p>
                <StyledButton
                    id="please-try-again-button"
                    className="my-[30px] mx-auto"
                    onClick={() => {
                        dispatch(updateInternetConnectionStatus({internetConnectionStatus: "UNKNOWN"}));
                        navigate('/');
                    }}
                >
                    Please try again
                </StyledButton>
            </div>
        </div>
    );
}

export default SomethingWentWrong;
