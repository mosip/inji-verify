import React from 'react';

const Step = ({stepNumber, activeOrCompleted}: {stepNumber: number, activeOrCompleted: boolean}) => {
    const stepperStep = "flex items-center";
    const stepperActiveOrCompleted = "rounded-full bg-[#FF7F00] text-white";
    const stepperUpcomingStep = "bg-white text-[#FF7F00]";
    const stepperCircle = "rounded-full border-[1px] border-[#FF7F00]";
    return (<div className={`${stepperStep} ${activeOrCompleted ? stepperActiveOrCompleted : stepperUpcomingStep}`} data-step="1">
        <div className={`flex items-center justify-center w-10 h-10 ${stepperCircle}`}>{stepNumber}</div>
    </div>);
}

function MobileStepper(props: any) {
    const stepperLine = "flex-grow border-t-2 border-[#FFDFB4]";
    return (
        <div className="block md:hidden container mx-auto mt-10">
            <div className="flex justify-between items-center w-full max-w-xl mx-auto" id="stepper">
                <Step stepNumber={1} activeOrCompleted/>
                <div className={stepperLine}></div>
                <Step stepNumber={2} activeOrCompleted={false}/>
                <div className={stepperLine}></div>
                <Step stepNumber={3} activeOrCompleted={false}/>
            </div>
        </div>
    );
}

export default MobileStepper;
