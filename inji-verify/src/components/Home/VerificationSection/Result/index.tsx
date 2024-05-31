import React, {useEffect, useRef, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {useVerificationFlowSelector} from "../../../../redux/features/verification/verification.selector";

const Result = () => {
    const {vc, vcStatus} = useVerificationFlowSelector(state => state.verificationResult ?? {vc: null, vcStatus: null})
    let status: any = vcStatus?.status === "OK" ? "SUCCESS" : vcStatus?.checks[0].expired === "OK" ? "INVALID" : "EXPIRED";

    // validate vc and show success/failure component
    return (
        <div id="result-section" className="relative">
            <div className={`text-white`}>
                <ResultSummary status={status}/>
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: window.innerWidth >= 768 ? `532px` : "190px",
                    right: window.innerWidth >= 768 ? `calc((50vw - 400px) / 2)` : `calc((100vw - 340px) / 2)`
                }}>
                <VcDisplayCard vc={vcStatus?.status === "OK" ? vc : null}/>
            </div>
        </div>
    );
}

export default Result;
