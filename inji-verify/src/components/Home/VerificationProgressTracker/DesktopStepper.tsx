import React from 'react';
import {useAppSelector} from "../../../redux/hooks";
import {VerificationStep} from "../../../types/data-types";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";

const steps: VerificationStep[] = [
    {
        label: 'Select \'Scan QR Code\' or \'Upload QR Code\' ',
        description: ['Tap \'Scan QR Code\' and scan to capture the QR code shown on your digital credentials/card.', 'Tap ‘Upload QR Code’ to upload the preferred file.'],
    },
    {
        label: 'Activate your device’s camera',
        description: 'Activate your device camera for scanning: A notification will be prompt to activate your device camera (Valid for ‘Scan QR Code’ feature only)',
    },
    {
        label: 'Verify document',
        description: 'Allow Inji Verify to verify & validate the digital document / card'
    },
    {
        label: 'View result',
        description: 'Check the validation result'
    }
];

function DesktopStepper() {
    const activeScreen = useVerificationFlowSelector(state => state.activeScreen);
    const isLastStep = (index: number) => steps.length -1 === index;
    const isStepCompleted = (index: number) => activeScreen >= index;

    return (
        <div className="hidden pt-0 pb-[100px] pr-[60px] pl-[76px] md:flex flex-col items-start justify-start ml-0 mt-9">
            <div className="flex flex-col items-start space-y-2">
                {
                    steps.map((step, index) => (
                        <>
                            <div className="flex items-center">
                                <div
                                    className={`text-center rounded-full w-6 h-6 flex items-center justify-center font-normal text-normal text-[12px] leading-5  ${isStepCompleted(index) ? "bg-primary text-white border-1 border-none" : "bg-white text-primary border-[1px] border-primary"}`}
                                >
                                    {index + 1}
                                </div>
                                <div className={`ml-[10px] text-[16px]  font-bold ${isStepCompleted(index) ? "text-black" : "text-[#868686]"}`}>{step.label}</div>
                            </div>
                            <div className={"grid items-center m-0"}>
                                <div className="w-6 h-[100%] col-end-2">
                                    <div className={`${!isLastStep(index) ? "border-l-primary" : "border-none"} border-[1px] h-[100%] m-auto w-0`}/>
                                </div>
                                <div className="ml-[10px] text-[14px] text-[#535353] font-normal leading-5  col-end-13">
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
