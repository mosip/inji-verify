import React, { useEffect } from "react";
import { useVerificationFlowSelector, useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import { convertToId, fetchVerificationSteps } from "../../../utils/misc";
import i18n from "i18next";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { isRTL } from "../../../utils/i18n";

const DesktopStepper: React.FC = () => {
  const { mainActiveScreen, method } = useVerificationFlowSelector((state) => ({
    mainActiveScreen: state.activeScreen,
    method: state.method,
  }));
  const VerifyActiveScreen = useVerifyFlowSelector((state) => state.activeScreen );
  const isPartiallyShared = useVerifyFlowSelector((state) => state.isPartiallyShared );
  const activeScreen = (method === "VERIFY") ? VerifyActiveScreen : mainActiveScreen;
  const steps = fetchVerificationSteps(method, isPartiallyShared);
  const isLastStep = (index: number) => steps.length - 1 === index;
  const isStepCompleted = (index: number) => activeScreen > index;
  const language = useAppSelector((state: RootState) => state.common.language);
  const rtl = isRTL(language);

  useEffect(() => {
    fetchVerificationSteps(method,isPartiallyShared);

    const handleLanguageChange = () => {
      fetchVerificationSteps(method,isPartiallyShared);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [isPartiallyShared, method]);

  return (
    <div className="hidden pr-[60px] pl-[76px] lg:flex flex-col items-start justify-start ml-0 mt-9 max-h-[100%]">
      <div className="flex flex-col items-start space-y-2">
        {steps.map((step: any, stepCount: number) => {
          const lastStepMargin = rtl ? "mr-9" : "ml-9";
          const stepMargin = rtl ? "mr-[10px]" : "ml-[10px]";
          const marginClass = isLastStep(stepCount) ? lastStepMargin : stepMargin;

          return (
            <div key={stepCount}>
              <div className="flex items-center">
                <div
                  className={`bg-${window._env_.DEFAULT_THEME}-gradient rounded-full bg-no-repeat p-[2px] flex items-center justify-center`}
                >
                  <div
                    className={`text-center rounded-full w-6 h-6 flex items-center justify-center font-normal text-normal text-smallTextSize leading-5 bg-no-repeat  ${
                      isStepCompleted(stepCount)
                        ? `bg-${window._env_.DEFAULT_THEME}-gradient text-white border-1 border-transparent`
                        : "bg-white text-primary border-[1px] border-transparent"
                    }`}
                  >
                    {stepCount + 1}
                  </div>
                </div>
                <div
                  id={convertToId(step.label)}
                  className={`${stepMargin} text-lgNormalTextSize font-bold ${
                    isStepCompleted(stepCount) ? "text-black" : "text-stepperLabel"
                  }`}
                >
                  {step.label}
                </div>
              </div>
              <div className={"grid items-start"}>
                <div className={"grid items-center m-0"}>
                  {!isLastStep(stepCount) && (
                    <div
                      className={`w-6 h-[100%] col-end-2 ${
                        isStepCompleted(stepCount + 1) ? "" : "opacity-20"
                      }`}
                    >
                      <div
                        className={`bg-${window._env_.DEFAULT_THEME}-gradient mt-1 w-[1px] h-full m-auto`}
                      >
                        <div
                          className={`${
                            !isLastStep(stepCount)
                              ? "border-transparent border-l-transparent"
                              : "border-none"
                          } border-[1px]`}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    id={`${convertToId(step.label)}-description`}
                    className={`${marginClass}  text-normalTextSize text-stepperDescription font-normal col-end-13`}
                  >
                    {step.description
                      .split("<span>")
                      .map((text: string, index: number) =>
                        index % 2 === 1 ? (
                          <span style={{fontStyle: "italic"}}>
                          "{text.trim()}"
                        </span>
                        ) : (
                          text
                        )
                      )}
                  </div>
                  {!isLastStep(stepCount) && (
                    <div
                      className={`col-end-2 ${
                        isStepCompleted(stepCount + 1) ? "" : "opacity-20"
                      }`}
                    >
                      <div
                        className={`bg-${window._env_.DEFAULT_THEME}-gradient w-[1px] h-8 m-auto`}
                      >
                        <div
                          className="border-transparent border-l-primary border-[1px]"/>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopStepper;
