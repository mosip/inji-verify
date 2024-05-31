import React from 'react';
import {ReactComponent as VerificationSuccessIcon} from "../../../../assets/verification-success-icon.svg";
import {ReactComponent as VerificationFailedIcon} from "../../../../assets/verification-failed-icon.svg";
import {ReactComponent as VerificationSuccessMobileIcon} from "../../../../assets/verification-success-icon-mobile.svg";
import {ReactComponent as VerificationFailedMobileIcon} from "../../../../assets/verification-failed-icon-mobile.svg";

const backgroundColorMapping: any = {
    EXPIRED: "bg-[#BF7A1C]",
    INVALID: "bg-[#D73E3E]",
    SUCCESS: "bg-[#57A04B]"
}

const displayMessageMapping = {
    EXPIRED: "Unfortunately, the given credential is expired!",
    INVALID: "Unfortunately, the given credential is invalid!",
    SUCCESS: "Congratulations, the given credential is valid!"
}

const ResultSummary = ({status}: {
    status: "SUCCESS" | "EXPIRED" | "INVALID"
}) => {
    const backgroundColor = backgroundColorMapping[status]
    return (
        <div className="grid">
            <div className="xs:col-end-13 md:hidden text-center bg-white text-black pb-8">
                <p className="font-bold text-[16px]">
                    View Results
                </p>
                <p className="text-[14px]">
                    View the verification result.
                </p>
            </div>
            <div className={`xs:col-end-13 h-[170px] md:h-[340px] ${backgroundColor}`}>
                <div className="grid justify-items-center items-center justify-center content-center pt-[30px]">
                    <div className={`col-end-13 hidden md:grid rounded-[50%] bg-white h-[68px] w-[68px] content-center justify-center text-[24px] mx-auto my-[7px] ${backgroundColor}`}>
                        {status === "SUCCESS" ? <VerificationSuccessIcon/> : <VerificationFailedIcon/>}
                    </div>
                    <div className="col-end-13 block md:hidden mb-2.5">
                        {status === "SUCCESS" ? <VerificationSuccessMobileIcon/> : <VerificationFailedMobileIcon/>}
                    </div>
                    <div className="hidden md:block col-end-13">
                        <p className="font-bold text-[20px]  mx-auto my-[7px]">
                            Results
                        </p>
                    </div>
                    <div className="col-end-13">
                        <p className="font-normal text-[16px]">
                            {
                                displayMessageMapping[status]
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultSummary;
