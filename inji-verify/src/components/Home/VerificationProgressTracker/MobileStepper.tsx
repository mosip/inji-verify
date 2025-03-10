import React, { useState } from 'react';
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {VerificationStepsContent} from "../../../utils/config";
import {convertToId, getRangeOfNumbers, getVerificationStepsCount} from "../../../utils/misc";
import Modal from "./modal";
import tickImage from "../../../assets/images/tick_.gif";

const Step = ({stepNumber, activeOrCompleted, }: {stepNumber: number, activeOrCompleted: boolean}) => {
    const stepperStep = "flex items-center";
    const stepperActiveOrCompleted = "rounded-full bg-primary text-whiteText";
    const stepperUpcomingStep = "bg-background text-primary";
    const stepperCircle = "rounded-full border-[1px] border-primary";
   
    return (
        <div className={`${stepperStep} ${activeOrCompleted ? stepperActiveOrCompleted : stepperUpcomingStep}`}
             data-step="1">
            <div className={`flex items-center justify-center w-9 h-9 ${stepperCircle}`}>{stepNumber}</div>
        </div>
    );
}

function MobileStepper(props: any) {
    const {activeScreen, method} = useVerificationFlowSelector(state => ({activeScreen: state.activeScreen, method: state.method}));
    const stepperLine = "flex-grow border-t-2 border-primary w-[44px]";

    const stepCount = getVerificationStepsCount(method);
    const maxWidth = `${stepCount * 35 + (stepCount - 1) * 40}px`;

    const label = VerificationStepsContent[method][activeScreen - 1].label;
    const description = VerificationStepsContent[method][activeScreen - 1].description;
    const [showModal, setShowModal] = useState(false);

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
                <p id={convertToId(label)} className="font-bold text-stepperLabel my-1">
                    {label}
                </p>
                <p id={`${convertToId(label)}-description`} className="text-stepperDescription text-normalTextSize">
                    {description}
                </p>
            </div>
            <div className="col-start-1 col-end-13 text-center mt-5">
    <button 
        className={`px-5 py-2 rounded text-whiteText ${
            activeScreen === stepCount ? 'bg-primary' : 'bg-gray-400 opacity-50 cursor-not-allowed'
        }`}
        disabled={activeScreen !== stepCount}
        onClick={() => {
            if (activeScreen === stepCount) {
                setShowModal(true); // Open modal on click
            }
        }}
    >
        Allow Entry
    </button>
</div>

            {showModal && <Modal onClose={() => setShowModal(false)} tickImage={tickImage} />}
        </div>
    );
}

export default MobileStepper;
