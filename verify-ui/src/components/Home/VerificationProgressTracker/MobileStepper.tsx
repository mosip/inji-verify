import React, { useEffect } from "react";
import { useVerificationFlowSelector, useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import { convertToId, fetchVerificationSteps, getRangeOfNumbers } from "../../../utils/misc";
import { VerificationMethod } from "../../../types/data-types";
import i18n from "i18next";

const Step = ({ stepNumber, activeOrCompleted }: { stepNumber: number; activeOrCompleted: boolean; }) => {
  const stepperStep = "flex items-center";
  const stepperActiveOrCompleted = `rounded-full bg-${window._env_.DEFAULT_THEME}-gradient bg-no-repeat text-white`; // Keep only gradient here
  const stepperUpcomingStep = `bg-${window._env_.DEFAULT_THEME}-gradient bg-no-repeat rounded-full text-primary p-[2px]`;
  const stepperCircle = `${activeOrCompleted ? `bg-${window._env_.DEFAULT_THEME}-gradient` : "bg-white"
  } bg-no-repeat flex items-center justify-center w-9 h-9 rounded-full border-[1px] border-transparent`;
  return (
    <div className={`${stepperStep} ${ activeOrCompleted ? stepperActiveOrCompleted : stepperUpcomingStep }`} data-step="1" >
      <div className={stepperCircle}>{stepNumber}</div>
    </div>
  );
};

function MobileStepper() {
  let activeScreen: number;
  const { mainActiveScreen, method } = useVerificationFlowSelector((state) => ({
    mainActiveScreen: state.activeScreen,
    method: state.method,
  }));
  const VerifyActiveScreen = useVerifyFlowSelector((state) => state.activeScreen );
  const isPartiallyShared = useVerifyFlowSelector((state) => state.isPartiallyShared );

  if (method === "VERIFY") {
    activeScreen = VerifyActiveScreen;
  } else {
    activeScreen = mainActiveScreen;
  }

  const stepperLine = "flex-grow border-t-2 border-transparent";
  const VerificationStepsContent = fetchVerificationSteps(method as VerificationMethod, isPartiallyShared);
  const stepCount = VerificationStepsContent.length;
  const label = VerificationStepsContent[activeScreen - 1].label;
  const description: string = VerificationStepsContent[activeScreen - 1].description as string;

  useEffect(() => {
    fetchVerificationSteps(method as VerificationMethod, isPartiallyShared);

    const handleLanguageChange = () => {
      fetchVerificationSteps(method, isPartiallyShared);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [method]);

  return (
    <div className={`grid grid-cols-13 lg:hidden flex flex-column mx-auto items-center`}>
      <div
        className="col-start-1 col-end-13 flex items-center mx-auto p-4"
        id="stepper"
      >
        {getRangeOfNumbers(stepCount).map((value, index) => (
          <div key={index} className="flex flex-column items-center">
            <Step
              stepNumber={value}
              activeOrCompleted={value <= activeScreen}
            />
            {value < stepCount && (
              <div className={`bg-${ window._env_.DEFAULT_THEME }-gradient p-[1px] w-[44px] h-[1px] ${ value >= activeScreen ? "opacity-20" : "" }`} >
                <div className={stepperLine} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="col-start-1 col-end-13 text-center px-4">
        <p id={convertToId(label)} className="font-bold text-stepperLabel md:text-smallTextSize text-normalTextSize my-1">
          {label}
        </p>
        <p
          id={`${convertToId(label)}-description`}
          className="text-stepperDescription text-smallTextSize md:text-normalTextSize"
        >
          {description.split("<span>").map((text: string, index: number) =>
              index % 2 === 1 ? <span style={{ fontStyle: "italic" }}>"{text.trim()}"</span> : text
          )}
        </p>
      </div>
    </div>
  );
}

export default MobileStepper;
