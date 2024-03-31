import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {Box} from "@mui/material";
import StyledButton from "../commons/StyledButton";

const getPositioning = (resultSectionRef: React.RefObject<HTMLDivElement>) => {
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

const Result = ({vc, setActiveStep}: {
    vc: any, setActiveStep: (activeStep: number) => void
}) => {
    const initialPositioning: {top?: number, right?: number} = {};
    const resultSectionRef = React.createRef<HTMLDivElement>();
    const [vcDisplayCardPositioning, setVcDisplayCardPositioning] = useState(initialPositioning);

    useEffect(()=> {
        if (resultSectionRef?.current && !(!!vcDisplayCardPositioning.top)) {
            let positioning = getPositioning(resultSectionRef);
            console.log("Positioning: ", positioning);
            setVcDisplayCardPositioning(positioning);
        }
    }, [resultSectionRef]);

    let success = true;
    // validate vc and show success/failure component
    return (
        <Box id="result-section" ref={resultSectionRef}>
            <Box style={{height: "340px",
                backgroundColor: success ? "#4B9D1F": "#CB4242",
                color: "white"}}>
                <ResultSummary success={success} vc={null} setActiveStep={setActiveStep}/>
            </Box>
            <Box style={{
                margin: "auto",
                position: "absolute",
                top: `${vcDisplayCardPositioning.top ?? 212}px`,
                right: `${vcDisplayCardPositioning.right ?? 0}px`
            }}>
                <VcDisplayCard
                    vc={{
                        credentialSubject: {
                            "Full Name": "Shiva Kumar",
                            "DOB": "02-09-1996",
                            "Policy Name": "Policy 1",
                            "Policy Number": "123456",
                            "Status": "Valid",
                            "Expires On": "2025-12-31"
                        }
                    }}
                />
                <StyledButton style={{margin: "24px auto"}}>
                    Scan Another QR Code
                </StyledButton>
            </Box>
        </Box>
    );
}

export default Result;
