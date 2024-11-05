import React, { useEffect, useState } from 'react';
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {convertToId, getRangeOfNumbers, getVerificationStepsCount} from "../../../utils/misc";
import { VerificationMethod, VerificationStepsContentType } from '../../../types/data-types';
import { getVerificationStepsContent } from '../../../utils/config';
import i18n from "i18next";

const Step = ({stepNumber, activeOrCompleted, }: {stepNumber: number, activeOrCompleted: boolean}) => {
    const stepperStep = "flex items-center";
    const stepperActiveOrCompleted = "rounded-full bg-gradient bg-no-repeat text-white"; // Keep only gradient here
    const stepperUpcomingStep = "bg-gradient bg-no-repeat rounded-full text-primary p-[2px]";
    const stepperCircle = `${activeOrCompleted ? "bg-gradient" : "bg-white"} bg-no-repeat flex items-center justify-center w-9 h-9 rounded-full border-[1px] border-transparent`;
    return (
        <div className={`${stepperStep} ${activeOrCompleted ? stepperActiveOrCompleted : stepperUpcomingStep}`}
             data-step="1">
            <div className={stepperCircle}>{stepNumber}</div>
        </div>
    );
}

function MobileStepper(props: any) {
    const {activeScreen, method} = useVerificationFlowSelector(state => ({activeScreen: state.activeScreen, method: state.method}));
    const stepperLine = "flex-grow border-t-2 border-transparent";
    const [VerificationStepsContent, SetVerificationStepsContent] = useState<VerificationStepsContentType>(getVerificationStepsContent());
    const stepCount = getVerificationStepsCount(method);
    const maxWidth = `${stepCount * 35 + (stepCount - 1) * 40}px`;

    const label = VerificationStepsContent[method as VerificationMethod][activeScreen - 1].label;
    const description = VerificationStepsContent[method as VerificationMethod][activeScreen - 1].description;

    useEffect(() => {
        const fetchVerificationSteps = () => {
            SetVerificationStepsContent(getVerificationStepsContent());
        };

        fetchVerificationSteps();

        const handleLanguageChange = () => {
            fetchVerificationSteps();
        };

        i18n.on('languageChanged', handleLanguageChange);
        
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [method]);

    return (
        <div className={`grid grid-cols-12 lg:hidden container mx-auto my-7`}>
            <div className="col-start-1 col-end-13 flex justify-between items-center w-full max-w-xl mx-auto mb-7"
                 style={{maxWidth}}
                 id="stepper">
                {
                    getRangeOfNumbers(stepCount).map((value, index) => (
                        <>
                            <Step stepNumber={value} activeOrCompleted={value <= activeScreen}/>
                            {(value < stepCount) && (<div className={`bg-gradient p-[1px] w-[44px] ${value >= activeScreen ? "opacity-20" : ""}`}><div className={stepperLine}/></div>)}
                        </>
                    ))
                }
            </div>
            <div className="col-start-1 col-end-13 text-center">
                <p id={convertToId(label)} className="font-bold text-stepperLabel my-1">
                    {label}
                </p>
                <p id={`${convertToId(label)}-description`} className="text-stepperDescription text-normalTextSize">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default MobileStepper;
