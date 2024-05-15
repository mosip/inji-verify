import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {Box, useMediaQuery} from "@mui/material";
import {CardPositioning, VcStatus} from "../../../../types/data-types";
import {SetActiveStepFunction} from "../../../../types/function-types";
import {ResultsSummaryContainer, VcDisplayCardContainer} from "./styles";

const Result = ({vc, setActiveStep, vcStatus}: {
    vc: any, setActiveStep: SetActiveStepFunction, vcStatus: VcStatus | null
}) => {
    const resultSectionRef = React.createRef<HTMLDivElement>();
    const isMobile = useMediaQuery("@media (max-width: 900px)");

    let success = vcStatus?.status === "OK";
    // validate vc and show success/failure component
    return (
        <Box id="result-section" ref={resultSectionRef}>
            <ResultsSummaryContainer success={success} isMobile={isMobile}>
                <ResultSummary success={success} isMobile={isMobile}/>
            </ResultsSummaryContainer>
            <VcDisplayCardContainer style={{position: !isMobile ? "absolute" : "static"}}>
                <VcDisplayCard vc={vc} setActiveStep={setActiveStep}/>
            </VcDisplayCardContainer>
        </Box>
    );
}

export default Result;
