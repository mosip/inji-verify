import React from 'react';
import {ReactComponent as VerificationSuccessIcon} from "../../../../assets/verification-success-icon.svg";
import {ReactComponent as VerificationFailedIcon} from "../../../../assets/verification-failed-icon.svg";

const ResultSummary = ({success}: {
    success: boolean
}) => {
    return (
        <div className="grid">
            <div className="xs:col-end-13">
                <div className="grid justify-items-center items-center justify-center content-center pt-[30px]">
                    <div className={`col-end-13 grid rounded-[50%] bg-white h-[68px] w-[68px] content-center justify-center text-[24px] mx-auto my-[7px] ${success ? "bg-[#4B9D1F]": "bg-[#CB4242]"}`}>
                        {success ? <VerificationSuccessIcon/> : <VerificationFailedIcon/>}
                    </div>
                    <div className="col-end-13">
                        <p className="font-bold text-[20px]  mx-auto my-[7px]">
                            Results
                        </p>
                    </div>
                    <div className="col-end-13">
                        <p className="font-normal text-[4px] " style={{font: "normal normal normal 16px/20px Inter"}}>
                            {success
                                ? "Congratulations, the given credential is valid!"
                                : "Unfortunately, the given credential is invalid!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultSummary;
