import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {Box} from "@mui/material";
import {CardPositioning, VcStatus} from "../../../../types/data-types";
import {ResultsSummaryContainer, VcDisplayCardContainer} from "./styles";
import {useAppSelector} from "../../../../redux/hooks";

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

const Result = () => {
    const {vc, vcStatus} = useAppSelector(state => state.verificationResult ?? {vc: null, vcStatus: null})
    const initialPositioning: CardPositioning = {};
    const resultSectionRef = React.createRef<HTMLDivElement>();
    const [vcDisplayCardPositioning, setVcDisplayCardPositioning] = useState(initialPositioning);

    useEffect(() => {
        if (resultSectionRef?.current && !(!!vcDisplayCardPositioning.top)) {
            let positioning = getPositioning(resultSectionRef);
            setVcDisplayCardPositioning(positioning);
        }
    }, [resultSectionRef]);

    let success = vcStatus?.status === "OK";
    // validate vc and show success/failure component
    return (
        <Box id="result-section" ref={resultSectionRef}>
            <ResultsSummaryContainer success={success}>
                <ResultSummary success={success}/>
            </ResultsSummaryContainer>
            <VcDisplayCardContainer
                style={{position: "absolute"}}
                cardPositioning={{top: vcDisplayCardPositioning.top, right: vcDisplayCardPositioning.right}}>
                <VcDisplayCard vc={vc}/>
            </VcDisplayCardContainer>
        </Box>
    );
}

export default Result;
