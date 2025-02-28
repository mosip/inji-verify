import React from "react";
import { useVerificationFlowSelector } from "../../../redux/features/verification/verification.selector";
import { convertToId } from "../../../utils/misc";
import { useTranslation } from "react-i18next";

function DesktopStepper() {
  const { t } = useTranslation("stepper");
  const { activeScreen, method } = useVerificationFlowSelector((state) => ({
    activeScreen: state.activeScreen,
    method: state.method,
  }));

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
  const isLastStep = (index: number) => steps.length - 1 === index;
  const isStepCompleted = (index: number) => activeScreen > index;

  return (
    <div className="hidden pr-[60px] pl-[76px] lg:flex flex-col items-start justify-start ml-0 mt-9 max-h-[100%]">
      <div className="flex flex-col items-start space-y-2">
        {steps.map((step: any, index: number) => (
          <>
            <div className="flex items-center">
              <div
                className={`text-center rounded-full flex items-center justify-center font-normal text-normal text-[12px] leading-5 ${
                  isStepCompleted(index)
                    ? "bg-[#9E77ED] text-white border-1 border-none"
                    : "bg-white text-[#9E77ED] border-[1px]"
                }`}
              >
                {(isStepCompleted(index) && activeScreen !== index + 1) ||
                (steps.length - 1 === index && activeScreen === index + 1) ? (
                  <img
                    src="assets/images/check.svg"
                    alt="check"
                    className="!w-[2rem] brightness-125"
                  />
                ) : activeScreen === index + 1 ? (
                  <img
                    src="assets/images/dot.svg"
                    alt="dot"
                    className="!w-[2.25rem] rounded-[25px] bg-[#7F56D9] brightness-125 outline-2 outline-[#9E77ED]"
                  />
                ) : (
                  <img
                    src="assets/images/disabled_dot.svg"
                    alt="disabled_dot"
                    className="!w-[2rem]"
                  />
                )}
              </div>
              <div
                id={convertToId(step.label)}
                className={`ml-[10px] text-[16px] font-bold ${
                  isStepCompleted(index) ? "text-[#6941C6]" : "text-[#475467]"
                }`}
              >
                {step.label}
              </div>
            </div>
            <div className={"grid items-start"}>
              <div className={"grid items-center m-0"}>
                <div className="w-6 h-[100%] col-end-2">
                  <div
                    className={`${
                      !isLastStep(index)
                        ? "border-white border-l-[#E4E7EC]"
                        : "border-none"
                    } border-[1px] w-[1px] h-[100%] m-auto ml-4`}
                  />
                </div>
                <div
                  id={`${convertToId(step.label)}-description`}
                  className={`${
                    isStepCompleted(index) ? "text-[#6941C6]" : "text-[#475467]"
                  } ml-[1.35rem] text-[14px] font-normal leading-5  col-end-13`}
                >
                  {step.description}
                </div>
                {!isLastStep(index) && (
                  <div className="col-end-2">
                    <div className="border-white border-l-[#E4E7EC] border-[1px] w-[2px] h-8 m-auto ml-4" />
                  </div>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default DesktopStepper;
