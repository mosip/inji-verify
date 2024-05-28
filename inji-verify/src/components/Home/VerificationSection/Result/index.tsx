import React from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {useVerificationFlowSelector} from "../../../../redux/features/verification/verification.selector";

const Result = () => {
    const {vc, vcStatus} = useVerificationFlowSelector(state => state.verificationResult ?? {vc: null, vcStatus: null})
    let success = vcStatus?.status === "OK";
    // validate vc and show success/failure component
    return (
        <div id="result-section">
            <div className={`h-[170px] md:h-[340px] text-white ${success ? "bg-[#4B9D1F]" : "bg-[#CB4242]"}`}>
                <ResultSummary success={success}/>
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: window.innerWidth >= 768 ? `532px` : `585px`,
                    right: window.innerWidth >= 768 ? `calc((50vw - 400px) / 2)` : `calc((100vw - 340px) / 2)`
                }}>
                <VcDisplayCard vc={vcStatus?.status === "OK" ? vc : null}/>
            </div>
        </div>
    );
}

export default Result;
