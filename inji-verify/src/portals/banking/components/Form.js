import React, { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";

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
      <div className="rounded-[2rem] bg-white shadow-md">
        <div className="px-[3rem] py-[2rem] border-b border-b-[#D7D8E1]">
          <p className="font-semibold text-[24px]">Fill Details</p>
          <p className="text-[#2C3345]">
            Ut faucibus est ut amet at mattis proin. A nec lacinia faucibus
            tincidunt adipiscing.
          </p>
        </div>
        <div className="px-[3rem] py-[2rem] border-b border-b-[#D7D8E1]  scrollable-div">
          <div className="mb-6">
            <p className="font-semibold text-[24px]">(1) Loan Details</p>
            <p className="text-[#2C3345] mt-6 mb-3">
              Have you availed a loan before?
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
                NO
              </label>
              <input
                type="radio"
                className="mr-2 scale-125"
                id="yes"
                value="yes"
                name="avail_loan_before"
              />
              <label htmlFor="yes">YES</label>
            </div>
            <div className="flex mt-6">
              <div className="w-full mr-4">
                <p className="mb-2">Type of Loan</p>
                <Select
                  styles={customStyles}
                  isSearchable={false}
                  className="appearance-none"
                  options={loanTypes}
                  placeholder="Select an Option"
                />
              </div>
              <div className="w-full ml-4">
                <p className="mb-2">Loan amount</p>
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
            <p className="font-semibold text-[24px]">(2) Personal Details</p>
            <div className="flex my-6">
              <div className="w-full mr-4">
                <span className="mb-2">First Name</span>
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
                <span>Last Name</span>
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
                <span>Gender</span>
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
                <span>Phone Number</span>
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
                <span className="mb-2">Photo</span>
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
                <span>Email</span>
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
            <p className="font-semibold text-[24px]">(3) Residential Address</p>
            <div className="flex my-6">
              <div className="w-[49%] mr-4">
                <span>Address</span>
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
            <p className="font-semibold text-[24px]">(4) Declarations</p>
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
              I hereby declare that all the information provided is true and
              accurate. I consent to background verification based on my tax
              profile.
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
            Proceed{" "}
          </button>
        </div>
      </div>
    )
  );
};

export default Form;
