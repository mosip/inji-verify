import React from "react";
import { useTranslation } from "react-i18next";

const Result = () => {
  const { t } = useTranslation("loan_result");

  const list = [
    {
      label: t("approved_loan"),
      value: t("approved_loan_value"),
    },
    {
      label: t("roi"),
      value: t("roi_value"),
    },
    {
      label: t("tenure"),
      value: t("tenure_value"),
    },
  ];

  return (
    <div className="rounded-xl bg-white shadow-md pb-6 result text-[#42307D]">
      <div className="m-auto w-full">
        <img
          src="assets/gifs/success.gif"
          alt="success"
          className="block m-auto h-[250px]"
        />
        <p className="text-center font-semibold md:text-[36px] text-[32px] pb-4">
          {t("congrats")}
        </p>
        <p className="text-center text-[20px] my-4 px-2">
          {t("background_process")}
        </p>
        <div className="mt-6 mb-[1rem] flex flex-col xl:w-[35%] md:w-[50%] mx-2 sm:mx-auto">
          {list.map((item, idx) => {
            return (
              <div className="my-2 flex justify-center items-center">
                <img
                  src="assets/images/arrow_right.svg"
                  alt="arrow_right"
                  className="inline relative"
                />
                <span className="mx-4 w-48 text-left">{item.label}:</span>
                <span className="w-24">
                  {idx === 1 && (
                    <span className="text-[13px] line-through mr-1">{t("discounted_roi_value")}</span>
                  )}
                  <span className="text-[#14A35C] font-semibold">{item.value}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Result;
