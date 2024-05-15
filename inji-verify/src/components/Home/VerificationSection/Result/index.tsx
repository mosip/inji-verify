import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {Box, useMediaQuery} from "@mui/material";
import {CardPositioning, VcStatus} from "../../../../types/data-types";
import {SetActiveStepFunction} from "../../../../types/function-types";
import {ResultsSummaryContainer, VcDisplayCardContainer} from "./styles";

const getPositioning = (resultSectionRef: React.RefObject<HTMLDivElement>): CardPositioning => {
    // top = 340 - it is precalculated based in the xd design
    const positioning = {top: 212, right: 0};
    if (!!resultSectionRef?.current) {
        let resultSectionWidth = resultSectionRef.current.getBoundingClientRect().width;
        if (window.innerWidth === resultSectionWidth) {
            return positioning;
        }
        return {...positioning, right: (resultSectionWidth - 400) / 2};
    }
    return positioning;
}

const Result = ({vc, setActiveStep, vcStatus}: {
    vc: any, setActiveStep: SetActiveStepFunction, vcStatus: VcStatus | null
}) => {
    const initialPositioning: CardPositioning = {};
    const resultSectionRef = React.createRef<HTMLDivElement>();
    const [vcDisplayCardPositioning, setVcDisplayCardPositioning] = useState(initialPositioning);

    const isMobile = useMediaQuery("@media (max-width: 768px)");

    useEffect(() => {
        if (resultSectionRef?.current && !(!!vcDisplayCardPositioning.top)) {
            console.log("Recalculating the position")
            let positioning = getPositioning(resultSectionRef);
            console.log(positioning);
            setVcDisplayCardPositioning(positioning);
        }
    }, [resultSectionRef?.current]);

    let success = vcStatus?.status === "OK";
    // validate vc and show success/failure component
    return (
        <Box id="result-section" ref={resultSectionRef}>
            <ResultsSummaryContainer success={success} isMobile={isMobile}>
                <ResultSummary success={success} isMobile={isMobile}/>
            </ResultsSummaryContainer>
            <VcDisplayCardContainer
                style={{position: !isMobile ? "absolute" : "static"}}
                cardPositioning={{top: vcDisplayCardPositioning.top, right: vcDisplayCardPositioning.right}}>
                <VcDisplayCard vc={vc} setActiveStep={setActiveStep}/>
            </VcDisplayCardContainer>
        </Box>
    );
}

export default Result;
