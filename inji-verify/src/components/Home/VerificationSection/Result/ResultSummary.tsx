import React from 'react';
import {ReactComponent as VerificationSuccessIcon} from "../../../../assets/verification-success-icon.svg";
import {ReactComponent as VerificationFailedIcon} from "../../../../assets/verification-failed-icon.svg";
import {ReactComponent as VerificationSuccessMobileIcon} from "../../../../assets/verification-success-icon-mobile.svg";
import {ReactComponent as VerificationFailedMobileIcon} from "../../../../assets/verification-failed-icon-mobile.svg";

const backgroundColorMapping: any = {
    EXPIRED: "bg-[#BF7A1C]",
    INVALID: "bg-[#D73E3E]",
    SUCCESS: "bg-[#4B9D1F]"
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
        <div className="grid grid-cols-12 w-full">
            <div className={`col-start-1 col-end-13 h-[170px] lg:h-[186px] w-full ${backgroundColor}`}>
                <div className="grid grid-cols-12 justify-items-center items-center justify-center content-center pt-[30px]">
                    <div className="col-start-1 col-end-13 block mb-2.5">
                        {status === "SUCCESS" ? <VerificationSuccessMobileIcon/> : <VerificationFailedMobileIcon/>}
                    </div>
                    <div className="col-start-1 col-end-13">
                        <p className="font-normal text-[16px] text-center">
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
