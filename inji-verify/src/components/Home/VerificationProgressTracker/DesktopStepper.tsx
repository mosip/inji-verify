import React from 'react';
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {VerificationStepsContent} from "../../../utils/config";
import {convertToId} from "../../../utils/misc";

function DesktopStepper() {
    const {activeScreen, method} = useVerificationFlowSelector(state => ({
        activeScreen: state.activeScreen,
        method: state.method
    }));
    const steps = VerificationStepsContent[method];
    const isLastStep = (index: number) => steps.length -1 === index;
    const isStepCompleted = (index: number) => activeScreen > index;

    return (
        <div className="hidden pt-0 pb-[100px] pr-[60px] pl-[76px] lg:flex flex-col items-start justify-start ml-0 mt-9">
            <div className="flex flex-col items-start space-y-2">
                {
                    steps.map((step: any, index: number) => (
                        <>
                            <div className="flex items-center">
                                <div
                                    className={`text-center rounded-full w-6 h-6 flex items-center justify-center font-normal text-normal text-[12px] leading-5  ${isStepCompleted(index) ? "bg-primary text-white border-1 border-none" : "bg-white text-primary border-[1px] border-primary"}`}
                                >
                                    {index + 1}
                                </div>
                                <div id={convertToId(step.label)} className={`ml-[10px] text-[16px]  font-bold ${isStepCompleted(index) ? "text-black" : "text-[#868686]"}`}>{step.label}</div>
                            </div>
                            <div className={"grid items-center m-0"}>
                                <div className="w-6 h-[100%] col-end-2">
                                    <div className={`${!isLastStep(index) ? "border-l-primary" : "border-none"} border-[1px] h-[100%] m-auto w-0`}/>
                                </div>
                                <div id={`${convertToId(step.label)}-description`} className="ml-[10px] text-[14px] text-[#535353] font-normal leading-5  col-end-13">
                                    {step.description}
                                </div>
                                {
                                    !isLastStep(index) && (
                                        <div className="border-l-primary border-[1px] h-8 m-auto col-end-2"/>
                                    )
                                }
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    );
}

export default DesktopStepper;
