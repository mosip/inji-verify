import React from 'react';
import ResultSkeleton from "./ResultSkeleton";

const Result = ({vc, setActiveStep}: {
    vc: any, setActiveStep: (activeStep: number) => void
}) => {
    let success = true;
    // validate vc and show success/failure component
    return (
        <div style={{height: "340px",
            backgroundColor: success ? "#4B9D1F": "#CB4242",
            color: "white"}}>
            <ResultSkeleton success={success} vc={null} setActiveStep={setActiveStep}/>
        </div>
    );
}

export default Result;
