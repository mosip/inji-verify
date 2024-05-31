import React from 'react';
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";

const getRangeOfNumbers = (length: number): number[] => {
    return Array.from(new Array(length), (x, i) => i + 1);
}

const methodToStepsCountMap: any = {
    "UPLOAD": 3,
    "SCAN": 4
}

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

    const stepCount = methodToStepsCountMap[method];
    const maxWidth = `${stepCount * 35 + (stepCount - 1) * 40}px`
    return (
        <div className={`block lg:hidden container mx-auto my-7`} style={{maxWidth}}>
            <div className="flex justify-between items-center w-full max-w-xl mx-auto" id="stepper">
                {
                    getRangeOfNumbers(stepCount).map((value, index) => (
                        <>
                            <Step stepNumber={value} activeOrCompleted={value <= activeScreen}/>
                            {(value < stepCount) && (<div className={stepperLine}></div>)}
                        </>
                    ))
                }
            </div>
        </div>
    );
}

export default MobileStepper;
