import React from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {  useVerifyFlowSelector } from "../../../../redux/features/verification/verification.selector";

const VpSubmissionResult = (props: displayProps) => {
    const { vc, vcStatus } = useVerifyFlowSelector(state => state.verificationSubmissionResult ?? { vc: null, vcStatus: null })

    // validate vc and show success/failure component
    return (
        <div id="result-section" className="relative">
            <div className={`text-whiteText`}>
                <ResultSummary status={vcStatus} />
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: `106px`,
                    right: window.innerWidth >= 1024 ? `calc((50vw - 340px) / 2)` : `calc((100vw - 340px) / 2)`
                }}>
                <VcDisplayCard vc={vc ? vc : null} loc={props.loc}/>
            </div>
        </div>
    );
}

export type displayProps = {
    loc: string;
};
export default VpSubmissionResult;
