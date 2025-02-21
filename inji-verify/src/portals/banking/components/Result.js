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
    <div className="rounded-[2rem] bg-white shadow-md pb-6">
      <div className="m-auto w-full">
        <img
          src="assets/gifs/success.gif"
          alt="success"
          className="block m-auto h-[250px]"
        />
        <p className="text-center font-semibold text-[36px] py-4">
          {t("congrats")}
        </p>
        <p className="text-center text-[20px] mt-4 mb-6">
          {t("background_process")}
        </p>
        <div className="mt-6 mb-[1rem] flex flex-col w-[35%] mx-auto">
          {list.map((item) => {
            return (
              <div className="my-2 flex justify-between">
                <img
                  src="assets/images/arrow_right.svg"
                  alt="arrow_right"
                  className="inline relative top-[1px]"
                />
                <span className="mx-4 w-48 text-left">{item.label}:</span>
                <span className="text-[#14A35C] font-semibold w-24">
                  {item.value}
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
