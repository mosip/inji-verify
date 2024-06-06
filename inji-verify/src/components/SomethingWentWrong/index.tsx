import React from 'react';
import StyledButton from "../Home/VerificationSection/commons/StyledButton";
import {useNavigate} from "react-router-dom";

function SomethingWentWrong(props: any) {
    const navigate = useNavigate();
    return (
        <div className="grid content-center justify-center rounded-[10px] h-[540px] mx-auto my-7 shadow-lg text-center w-[90%] bg-white bg-no-repeat bg-clip-padding px-6">
            <div className="col-end-13">
                <img id="internet-offline-image" src={'/assets/images/under_construction.svg'} className="my-[30px] mx-auto w-[372px] max-w-[90%]" alt="offline"/>
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
