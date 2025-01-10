import React from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";

const VpSubmissionResult = ( vc:any, vcStatus:"SUCCESS" | "EXPIRED" | "INVALID" ) => {

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
                <VcDisplayCard vc={vc ? vc : null} />
            </div>
        </div>
    );
}

export default VpSubmissionResult;
