import React, { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ModalPopup from "./Modal";

const Form = (props) => {
  const { t } = useTranslation("form");
  const customStyles = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      padding: "0.25rem",
    }),
  };

  const loanTypes = [
    { value: t("home_loan"), label: t("home_loan") },
    { value: t("personal_loan"), label: t("personal_loan") },
    { value: t("education_loan"), label: t("education_loan") },
  ];

  const [isChecked, setIsChecked] = useState(false);

  const handleProceed = () => {
    props.child(1);
  };

  const handleTerms = (e) => {
    setIsChecked(e.target.checked);
  };

  const userInfo = JSON.parse(window.atob(localStorage.getItem("userInfo")));

  return (
    userInfo && (
      <>
        <ModalPopup />
        <div className="rounded-[2rem] bg-white shadow-md">
          <div className="px-[3rem] py-[2rem] border-b border-b-[#D7D8E1]">
            <p className="font-semibold text-[24px]">{t("fill_details")}</p>
            <p className="text-[#2C3345]">{t("details_description")}</p>
          </div>
          <div className="px-[3rem] py-[2rem] border-b border-b-[#D7D8E1]  scrollable-div">
            <div className="mb-6">
              <p className="font-semibold text-[24px]">{t("loan_details")}</p>
              <p className="text-[#2C3345] mt-6 mb-3">
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
                  className="mr-2 scale-125"
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
                  className="mr-2 scale-125"
                  id="yes"
                  value="yes"
                  name="avail_loan_before"
                />
                <label htmlFor="yes">{t("yes")}</label>
              </div>
              <div className="flex mt-6">
                <div className="w-full mr-4">
                  <p className="mb-2">{t("loan_type")}</p>
                  <Select
                    styles={customStyles}
                    isSearchable={false}
                    className="appearance-none"
                    options={loanTypes}
                    placeholder="Select an Option"
                  />
                </div>
                <div className="w-full ml-4">
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
            <div className="mt-[2.5rem]">
              <p className="font-semibold text-[24px]">
                {t("personal_details")}
              </p>
              <div className="flex my-6">
                <div className="w-full mr-4">
                  <span className="mb-2">{t("first_name")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo?.name}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 mb-6 mt-3"
                  />
                  <span>{t("last_name")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo?.name}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 mb-6 mt-3"
                  />
                  <span>{t("gender")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo.gender ?? "Male"}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 mb-6 mt-3"
                  />
                  <span>{t("phone_number")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value={userInfo.phone_number}
                    disabled
                    className="p-3 w-full rounded-md text-gray-500 mt-3"
                  />
                </div>

                <div className="w-full ml-4">
                  <span className="mb-2">{t("photo")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <img
                    alt={t("profile_picture")}
                    className="h-[167px] w-[167px] mb-[7.5rem] mt-3"
                    src={
                      userInfo?.picture
                        ? userInfo?.picture
                        : "assets/images/profile.svg"
                    }
                  />
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
                    className="p-3 w-full rounded-md text-gray-500 mt-3"
                  />
                </div>
              </div>
            </div>

            <div className="mt-[2.5rem]">
              <p className="font-semibold text-[24px]">
                {t("residential_address")}
              </p>
              <div className="flex my-6">
                <div className="w-[49%] mr-4">
                  <span>{t("address")}</span>
                  <img
                    src="assets/images/asterisk.svg"
                    alt="asterisk"
                    className="inline relative bottom-1"
                  />
                  <input
                    type="text"
                    value="#2342, Sector 30B, Chandigarh"
                    disabled
                    className="p-3 w-full rounded-md text-gray-500  mt-3"
                  />
                </div>
              </div>
            </div>

            <div className="mt-[2.5rem]">
              <p className="font-semibold text-[24px]">{t("declarations")}</p>
            </div>

            <div className="my-4">
              <input
                type="checkbox"
                id="signin"
                className="text-md scale-150 relative top-[1.5px] mr-1 hover:cursor-pointer"
                onChange={handleTerms}
              />
              <label for="signin" className="mx-0 text-[#5A7184] font-[400]">
                {" "}
                {t("terms&conditions")}
              </label>
            </div>
          </div>
          <div className="px-[3rem] py-[2rem] flex justify-end">
            <button
              type="submit"
              className="bg-[#53389E] px-[3rem] py-3 text-white rounded-md hover:cursor-pointer"
              onClick={handleProceed}
              disabled={!isChecked}
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
