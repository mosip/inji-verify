import React from "react";
import { useVerificationFlowSelector } from "../../../redux/features/verification/verification.selector";
import { VerificationStepsContent } from "../../../utils/config";
import {
  convertToId,
  getRangeOfNumbers,
  getVerificationStepsCount,
} from "../../../utils/misc";
import { useTranslation } from "react-i18next";

const Step = ({
  stepNumber,
  activeOrCompleted,
  active,
}: {
  stepNumber: number;
  activeOrCompleted: boolean;
  active: number;
}) => {
  const stepperStep = "flex items-center";
  const stepperActiveOrCompleted = "rounded-full bg-[#F2FCFF] text-white";
  const stepperUpcomingStep = "bg-white text-[#FF7F00]";
  const stepperCircle = "rounded-full border-[1px] border-[#F2FCFF]";
  return (
    <div
      className={`${stepperStep} ${
        activeOrCompleted ? stepperActiveOrCompleted : stepperUpcomingStep
      }`}
      data-step="1"
    >
      <div
        className={`flex items-center justify-center w-9 h-9 ${stepperCircle}`}
      >
        {active === stepNumber ? (
          <img src="assets/images/dot.svg" alt="dot" className="!w-[2rem]" />
        ) : activeOrCompleted ? (
          <img src="assets/images/check.svg" alt="dot" className="!w-[2rem]" />
        ) : (
          <img
            src="assets/images/disabled_dot.svg"
            alt="dot"
            className="!w-[2rem]"
          />
        )}
      </div>
    </div>
  );
};

function MobileStepper(props: any) {
  const { t } = useTranslation("stepper");
  const { activeScreen, method } = useVerificationFlowSelector((state) => ({
    activeScreen: state.activeScreen,
    method: state.method,
  }));
  const stepperLine = "flex-grow border-t-2 border-[#E4E7EC] w-[44px]";

  const stepCount = getVerificationStepsCount(method);
  const maxWidth = `${stepCount * 35 + (stepCount - 1) * 40}px`;

  const steps =
    method === "UPLOAD"
      ? [
          {
            label: t("upload_qr_code"),
            description: t("upload_qr_code_description"),
          },
          {
            label: t("verify_document"),
            description: t("verify_document_description"),
          },
          {
            label: t("view_result"),
            description: t("view_result_description"),
          },
        ]
      : [
          {
            label: t("scan_qr_code"),
            description: t("scan_qr_code_description"),
          },
          {
            label: t("activate_camera"),
            description: t("activate_camera_description"),
          },
          {
            label: t("verify_process"),
            description: t("verify_process_description"),
          },
          {
            label: t("view_result"),
            description: t("view_result_description"),
          },
        ];

  const heading = steps[activeScreen - 1].label;
  const description = steps[activeScreen - 1].description;

  return (
    <div className={`grid grid-cols-12 lg:hidden container mx-auto my-7`}>
      <div
        className="col-start-1 col-end-13 flex justify-between items-center w-full max-w-xl mx-auto mb-7"
        style={{ maxWidth }}
        id="stepper"
      >
        {getRangeOfNumbers(stepCount).map((value, index) => (
          <>
            <Step
              stepNumber={value}
              activeOrCompleted={value <= activeScreen}
              active={activeScreen}
            />
            {value < stepCount && <div className={stepperLine}></div>}
          </>
        ))}
      </div>
      <div className="col-start-1 col-end-13 text-center">
        <p id={convertToId(heading)} className="font-bold my-1">
          {heading}
        </p>
        <p
          id={`${convertToId(heading)}-description`}
          className="text-[#535353] text-[14px]"
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default MobileStepper;
