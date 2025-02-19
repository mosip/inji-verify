import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Result = (props) => {
  const navigate = useNavigate();

  const { t } = useTranslation("loan_result");
  const handleCredentials = () => {
    navigate("/verification", {
        state: props.langOptions
    });
  };

  return (
    <div className="rounded-[2rem] bg-white shadow-md py-6">
      <div className="lg:w-[40%] m-auto w-full">
        <p className="text-center font-semibold text-[36px] py-4">
          {t("congrats")}
        </p>
        <img
          src="assets/images/cibil.svg"
          alt="cibil"
          className="block m-auto"
        />
        <p className="text-center font-semibold text-[20px] mb-[3rem]">
          {t("background_process")}
        </p>
        <p className="text-center mb-3">
          {t("info")}
        </p>
        <button
          type="submit"
          className="bg-[#53389E] px-[3rem] py-3 text-white rounded-md block mx-auto mb-[4rem] hover:cursor-pointer"
          onClick={handleCredentials}
        >
          {t("verify_credentials")}{" "}
        </button>
      </div>
    </div>
  );
};

export default Result;
