import React from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import { useVerificationFlowSelector } from "../../../../redux/features/verification/verification.selector";
import { VcStatus } from "../../../../types/data-types";

const getVcStatusValue = (vcStatus: VcStatus)  => {return vcStatus.verificationStatus}

const Result = () => {
    const { vc, vcStatus } = useVerificationFlowSelector(state => state.verificationResult ?? { vc: null, vcStatus: null })
    const status = getVcStatusValue(vcStatus);

    // validate vc and show success/failure component
    return (
        <div id="result-section" className="relative">
            <div className={`text-whiteText`}>
                <ResultSummary status={status} />
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: `106px`,
                    right: window.innerWidth >= 1024 ? `calc((50vw - 340px) / 2)` : `calc((100vw - 340px) / 2)`
                }}>
                <VcDisplayCard vc={vcStatus?.verificationStatus !== "INVALID" ? vc : null} />
            </div>
        </div>
    );
}

export default Result;
