import React from 'react';
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {VerificationStepsContent} from "../../../utils/config";
import {convertToId} from "../../../utils/misc";
import { useTranslation } from 'react-i18next';

function DesktopStepper() {
    const {activeScreen, method} = useVerificationFlowSelector(state => ({
        activeScreen: state.activeScreen,
        method: state.method
    }));
    const {t} = useTranslation()
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
                                <div className='bg-gradient rounded-full p-[1px]'>
                                <div
                                    className={`text-center rounded-[9998px] w-6 h-6 flex items-center justify-center font-normal text-normal text-smallTextSize leading-5  ${isStepCompleted(index) ? "bg-gradient text-white border-1 border-transparent" : "bg-white text-primary border-[1px] border-transparent"}`}
                                >
                                    {index + 1}
                                </div>
                                </div>
                                
                                <div id={convertToId(step.label)} className={`ml-[10px] text-lgNormalTextSize font-bold ${isStepCompleted(index) ? "text-black" : "text-stepperLabel"}`}>{step.label}</div>
                            </div>
                            <div className={"grid items-start"}>
                                <div className={"grid items-center m-0"}>
                                {!isLastStep(index) && <div className={`w-6 h-[100%] col-end-2 ${isStepCompleted(index+1) ? '' : "opacity-20"}`}>
                                        <div className='bg-gradient w-[1px] h-full m-auto'>
                                        <div className={`${!isLastStep(index) ? "border-transparent border-l-transparent" : "border-none"} border-[1px]`}/>
                                        </div>
                                    </div>}
                                    <div id={`${convertToId(step.label)}-description`} className={`${isLastStep(index)?"ml-9":'ml-[10px]'}  text-normalTextSize text-stepperDescription font-normal col-end-13`}>
                                        {step.description}
                                    </div>
                                    {!isLastStep(index) && (
                                        <div className={`col-end-2 ${isStepCompleted(index+1) ? '' : "opacity-20"}`}>
                                            <div className='bg-gradient w-[1px] h-8 m-auto'>
                                                <div className="border-transparent border-l-primary border-[1px]"/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    );
}

export default DesktopStepper;
