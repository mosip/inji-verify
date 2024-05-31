import React from 'react';
import {ReactComponent as VerificationSuccessIcon} from "../../../../assets/verification-success-icon.svg";
import {ReactComponent as VerificationFailedIcon} from "../../../../assets/verification-failed-icon.svg";
import {ReactComponent as VerificationSuccessMobileIcon} from "../../../../assets/verification-success-icon-mobile.svg";
import {ReactComponent as VerificationFailedMobileIcon} from "../../../../assets/verification-failed-icon-mobile.svg";


const ResultSummary = ({success}: {
    success: boolean
}) => {
    return (
        <div className="grid">
            <div className="xs:col-end-13 md:hidden text-center bg-white text-black pb-8">
                <p className="font-bold text-lg">
                    View Results
                </p>
                <p>
                    View the verification result.
                </p>
            </div>
            <div className={`xs:col-end-13 h-[170px] md:h-[340px] ${success ? "bg-[#4B9D1F]" : "bg-[#CB4242]"}`}>
                <div className="grid justify-items-center items-center justify-center content-center pt-[30px]">
                    <div className={`col-end-13 hidden md:grid rounded-[50%] bg-white h-[68px] w-[68px] content-center justify-center text-[24px] mx-auto my-[7px] ${success ? "bg-[#4B9D1F]": "bg-[#CB4242]"}`}>
                        {success ? <VerificationSuccessIcon/> : <VerificationFailedIcon/>}
                    </div>
                    <div className="col-end-13 block md:hidden mb-2.5">
                        {success ? <VerificationSuccessMobileIcon/> : <VerificationFailedMobileIcon/>}
                    </div>
                    <div className="hidden md:block col-end-13">
                        <p className="font-bold text-[20px]  mx-auto my-[7px]">
                            Results
                        </p>
                    </div>
                    <div className="col-end-13">
                        <p className="font-normal text-[16px]">
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
