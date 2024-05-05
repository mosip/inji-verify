import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {CardPositioning, VcStatus} from "../../../../types/data-types";
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
            console.log("Positioning updated to: ", positioning);
        }
    }, [resultSectionRef]);

    let success = vcStatus?.status === "OK";
    // validate vc and show success/failure component
    return (
        <div id="result-section" ref={resultSectionRef}>
            <div className={`h-[340px] text-white ${success ? "bg-[#4B9D1F]" : "bg-[#CB4242]"}`}>
                <ResultSummary success={success}/>
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: `${vcDisplayCardPositioning.top ?? 212}px`,
                    right: `${vcDisplayCardPositioning.right ?? 0}px`
                }}>
                <VcDisplayCard vc={vcStatus?.status === "OK" ? vc : null}/>
            </div>
        </div>
    );
}

export default Result;
