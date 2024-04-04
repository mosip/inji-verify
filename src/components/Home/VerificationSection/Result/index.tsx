import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {Box} from "@mui/material";
import StyledButton from "../commons/StyledButton";
import {CardPositioning, VcStatus} from "../../../../types/data-types";
import {SetActiveStepFunction} from "../../../../types/function-types";

const getPositioning = (resultSectionRef: React.RefObject<HTMLDivElement>): CardPositioning => {
    // top = 340 - it is precalculated based in the xd design
    const positioning = {top: 212, right: 0};
    if (!!resultSectionRef?.current) {
        let resultSectionWidth = resultSectionRef.current.getBoundingClientRect().width;
        if (window.innerWidth === resultSectionWidth) {
            return positioning;
        }
        return {...positioning, right: (resultSectionWidth - 340) / 2};
    }
    return positioning;
}

const Result = ({vc, setActiveStep, vcStatus}: {
    vc: any, setActiveStep: SetActiveStepFunction, vcStatus: VcStatus | null
}) => {
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
            <Box style={{
                height: "340px",
                backgroundColor: success ? "#4B9D1F" : "#CB4242",
                color: "white"
            }}>
                <ResultSummary success={success} vc={null} setActiveStep={setActiveStep}/>
            </Box>
            <Box style={{
                margin: "auto",
                position: "absolute",
                top: `${vcDisplayCardPositioning.top ?? 212}px`,
                right: `${vcDisplayCardPositioning.right ?? 0}px`
            }}>
                {vc && <VcDisplayCard vc={vc}/>}
            </Box>
            <Box style={{
                height: 'calc(100vh - 340px)',
                display: 'grid',
                placeContent: 'center'
            }}>
                <StyledButton style={{margin: "24px auto"}} onClick={() => {
                    setActiveStep(0)
                }}>
                    Scan Another QR Code
                </StyledButton>
            </Box>
        </Box>
    );
}

export default Result;
