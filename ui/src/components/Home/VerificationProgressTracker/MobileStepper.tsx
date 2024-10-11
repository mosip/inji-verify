import React from 'react';
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {VerificationStepsContent} from "../../../utils/config";
import {convertToId, getRangeOfNumbers, getVerificationStepsCount} from "../../../utils/misc";

const Step = ({stepNumber, activeOrCompleted, }: {stepNumber: number, activeOrCompleted: boolean}) => {
    const stepperStep = "flex items-center";
    const stepperActiveOrCompleted = "rounded-full bg-[#FF7F00] text-white";
    const stepperUpcomingStep = "bg-white text-[#FF7F00]";
    const stepperCircle = "rounded-full border-[1px] border-[#FF7F00]";
    return (
        <div className={`${stepperStep} ${activeOrCompleted ? stepperActiveOrCompleted : stepperUpcomingStep}`}
             data-step="1">
            <div className={`flex items-center justify-center w-9 h-9 ${stepperCircle}`}>{stepNumber}</div>
        </div>
    );
}

function MobileStepper(props: any) {
    const {activeScreen, method} = useVerificationFlowSelector(state => ({activeScreen: state.activeScreen, method: state.method}));
    const stepperLine = "flex-grow border-t-2 border-[#FFDFB4] w-[44px]";

    const stepCount = getVerificationStepsCount(method);
    const maxWidth = `${stepCount * 35 + (stepCount - 1) * 40}px`;

    const heading = VerificationStepsContent[method][activeScreen - 1].label;
    const description = VerificationStepsContent[method][activeScreen - 1].description;

    return (
        <div className={`grid grid-cols-12 lg:hidden container mx-auto my-7`}>
            <div className="col-start-1 col-end-13 flex justify-between items-center w-full max-w-xl mx-auto mb-7"
                 style={{maxWidth}}
                 id="stepper">
                {
                    getRangeOfNumbers(stepCount).map((value, index) => (
                        <>
                            <Step stepNumber={value} activeOrCompleted={value <= activeScreen}/>
                            {(value < stepCount) && (<div className={stepperLine}></div>)}
                        </>
                    ))
                }
            </div>
            <div className="col-start-1 col-end-13 text-center">
                <p id={convertToId(heading)} className="font-bold my-1">
                    {heading}
                </p>
                <p id={`${convertToId(heading)}-description`} className="text-[#535353] text-[14px]">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default MobileStepper;
