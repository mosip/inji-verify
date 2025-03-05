import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ModalPopup from "./Modal";

const Form = (props) => {
  const { t, i18n } = useTranslation("form");
  const customStyles = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      padding: "0.25rem",
    }),
  };

  const loanTypes = [
    { value: "business_loan", label: t("business_loan") },
    { value: "agriculture_loan", label: t("agriculture_loan") },
    { value: "education_loan", label: t("education_loan") },
  ];

  const [isChecked, setIsChecked] = useState(false);
  const [loanType, setLoanType] = useState(null);

  const handleProceed = () => {
    props.child(1);
    localStorage.removeItem("userInfo");
  };

  const handleTerms = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSelect = (e) => {
    setLoanType(e.value); // Store the key instead of the translated text
  };

  // Ensure loanType updates when language changes
  useEffect(() => {
    if (loanType) {
      setLoanType(loanType); // This will trigger a re-render with the new translation
    }
  }, [i18n.language]); // Runs whenever the language changes

  const isUserInfo = localStorage.getItem("userInfo");

  const userInfo = isUserInfo ? JSON.parse(window.atob(isUserInfo)) : "";

  return (
    userInfo && (
      <>
        <ModalPopup />
        <div className="rounded-xl bg-white shadow-md">
          <div className="md:p-[2rem] border-b border-b-[#D7D8E1] p-3">
            <p className="font-semibold sm:text-[24px] text-[22px]">
              {t("fill_details")}
            </p>
            <p className="text-[#2C3345] mt-3 mb-1">
              {t("details_description")}
            </p>
          </div>
          <div className="md:p-[2rem] border-b border-b-[#D7D8E1]  scrollable-div p-3">
            <div className="sm:mb-6 mb-3">
              <p className="font-semibold sm:text-[24px] text-[22px]">
                {t("loan_details")}
              </p>
              <p className="text-[#2C3345] sm:mt-6 my-3">
                {t("avail_loan_before")}
                <img
                  src="assets/images/asterisk.svg"
                  alt="asterisk"
                  className="inline relative bottom-1"
                />
              </p>
              <div className="flex my-4">
                <input
                  type="radio"
                  className="mr-2 scale-125 hover:cursor-pointer"
                  id="no"
                  value="no"
                  name="avail_loan_before"
                  checked
                />
                <label htmlFor="no" className="mr-[2rem]">
                  {t("no")}
                </label>
                <input
                  type="radio"
                  className="mr-2 scale-125 hover:cursor-pointer"
                  id="yes"
                  value="yes"
                  name="avail_loan_before"
                />
                <label htmlFor="yes">{t("yes")}</label>
              </div>
              <div className="sm:flex mt-6">
                <div className="w-full mr-4">
                  <span>{t("loan_type")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <Select
                    styles={customStyles}
                    isSearchable={false}
                    className="mt-[0.6rem]"
                    options={loanTypes}
                    placeholder={t("select_option")}
                    onChange={handleSelect}
                    value={loanType ? { value: loanType, label: t(loanType) } : t("select_option")}
                  />
                </div>
                <div className="w-full sm:ml-4 mt-4 sm:mt-0">
                  <p className="mb-2">{t("loan_amount")}</p>
                  <input
                    type="text"
                    value="USD 10,000"
                    disabled
                    className="p-3 w-full rounded-md text-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="sm:mt-[2.5rem] mt-6">
              <p className="font-semibold sm:text-[24px] text-[22px]">
                {t("personal_details")}
              </p>
              <div class="grid sm:my-6 my-4 grid-cols-2 sm:gap-x-8">
                <div class="row-span sm:col-span-1 col-span-12">
                  <span className="mb-2">{t("full_name")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo?.name}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 sm:mb-6 my-4"
                  />
                </div>
                <div class="row-span-3 sm:col-span-1 col-span-12">
                  <span className="mb-2">{t("photo")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <img
                    alt={t("profile_picture")}
                    className="h-[167px] w-[167px] sm:mb-[7.5rem] my-4"
                    src={
                      userInfo?.picture
                        ? userInfo?.picture
                        : "assets/images/profile.svg"
                    }
                  />
                </div>
                <div class="row-span sm:col-span-1 col-span-12">
                  <span>{t("gender")}</span>
                  <input
                    type="text"
                    value={userInfo.gender ?? ""}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 sm:mb-6 my-4"
                  />
                </div>
                <div class="row-span sm:col-span-1 col-span-12">
                  <span>{t("dob")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo.birthdate}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 sm:mb-6 my-4"
                  />
                </div>
                <div class="row-span sm:col-span-1 col-span-12">
                  <span>{t("email")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo.email}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 my-4 mt-3"
                  />
                </div>
                <div class="row-span sm:col-span-1 col-span-12">
                  <span>{t("phone_number")}</span>
                  <input
                    type="text"
                    value={userInfo.phone_number}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 mt-3"
                  />
                </div>
              </div>
            </div>

            <div className="sm:mt-[2.5rem] mt-6">
              <p className="font-semibold sm:text-[24px] text-[22px]">
                {t("residential_address")}
              </p>
              <div className="flex sm:my-6 my-3">
                <div className="sm:w-[48.5%] md:mr-4 w-full">
                  <span>{t("address")}</span>
                  <input
                    type="text"
                    value={
                      userInfo.address
                        ? Object.values(userInfo.address)
                            .map((v) => v.trim())
                            .join(", ")
                        : ""
                    }
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 mt-3 border"
                  />
                </div>
              </div>
            </div>

            <div className="sm:mt-[2.5rem] mt-6">
              <p className="font-semibold sm:text-[24px] text-[22px]">
                {t("declarations")}
              </p>
            </div>

            <div className="my-4 flex items-baseline">
              <input
                type="checkbox"
                id="signin"
                className="text-md scale-150 relative top-[1.5px] mx-2 sm:mx-0 hover:cursor-pointer w-12"
                onChange={handleTerms}
              />
              <label for="signin" className="mx-0 font-[400]">
                {" "}
                {t("terms&conditions")}
              </label>
            </div>
          </div>
          <div className="md:p-[2rem] flex justify-end p-3">
            <button
              type="submit"
              className="bg-[#7F56D9] px-[3rem] py-3 text-white rounded-md hover:cursor-pointer m-auto sm:m-0 w-full sm:w-max"
              onClick={handleProceed}
              disabled={!isChecked || !loanType}
            >
              {t("proceed")}{" "}
            </button>
          </div>
        </div>
      </>
    )
  );
};

export default Form;
