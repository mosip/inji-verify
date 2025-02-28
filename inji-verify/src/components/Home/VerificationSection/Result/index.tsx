import React from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {useVerificationFlowSelector} from "../../../../redux/features/verification/verification.selector";
import {VcStatus} from "../../../../types/data-types";

const getVcStatusValue = (vcStatus?: VcStatus): "SUCCESS" | "INVALID" | "EXPIRED" => {
    if (vcStatus?.status === "OK") {
        return "SUCCESS";
    }
    if (vcStatus?.checks && vcStatus?.checks.length === 1) {
        return vcStatus?.checks[0].expired === "OK" ? "INVALID" : "EXPIRED"
    }
    return "INVALID";
}

const Result = () => {
    const {vc, vcStatus} = useVerificationFlowSelector(state => state.verificationResult ?? {vc: null, vcStatus: null})
    const status = getVcStatusValue(vcStatus);

    // validate vc and show success/failure component
    return (
        <div id="result-section" className="relative">
            <div className={`text-white`}>
                <ResultSummary status={status}/>
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: `106px`,
                    right: window.innerWidth >= 1024 ? `calc((50vw - 340px) / 2)` : `calc((100vw - 340px) / 2)`
                }}>
                <VcDisplayCard vc={vcStatus?.status === "OK" ? vc : null} status={status}/>
            </div>
        </div>
    );
}

export default Result;
