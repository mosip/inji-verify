import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Result = (props) => {
  const navigate = useNavigate();

  const { t } = useTranslation("loan_result");
  const handleCredentials = () => {
    navigate("/verification", {
      state: props.langOptions,
    });
  };

  return (
    <div className="rounded-[2rem] bg-white shadow-md pb-6">
      <div className="lg:w-[40%] m-auto w-full">
        <img
          src="assets/gifs/success.gif"
          alt="success"
          className="block m-auto h-[250px]"
        />
        <p className="text-center font-semibold text-[36px] py-4">
          {t("congrats")}
        </p>
        <p className="text-center font-semibold text-[20px] mb-[3rem]">
          {t("background_process")}
        </p>
      </div>
    </div>
  );
};

export default Result;
