import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NavHeader from "../components/NavHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import relyingPartyService from "../services/relyingPartyService";
import clientDetails from "../constants/clientDetails";

const Loan = ({ langOptions }) => {
  const { t } = useTranslation("loan_page");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [successBanner, setSuccessBanner] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const { post_fetchUserInfo } = {
    ...relyingPartyService,
  };

  useEffect(() => {
    setSuccessBanner(true);
  }, []);

  const navLinks = ["home", "help"];

  const handleCross = () => {
    setSuccessBanner(false);
  };

  useEffect(() => {
    const getSearchParams = async () => {
      let authCode = searchParams.get("code");

      if (authCode) {
        getUserDetails(authCode);
      } else {
        return;
      }
    };
    getSearchParams();
  }, []);

  const getUserDetails = async (authCode) => {
    try {
      let client_id = clientDetails.clientId;
      let redirect_uri = clientDetails.redirect_uri_userprofile;
      let grant_type = clientDetails.grant_type;

      var userInformation = await post_fetchUserInfo(
        authCode,
        client_id,
        redirect_uri,
        grant_type
      );
      setUserInfo(userInformation);
    } catch (errormsg) {
      console.log(errormsg);
    }
  };

  const handleLoan = () => {
    if (userInfo) {
      navigate("/application", {
        state: userInfo,
      });
    }
  };

  return (
    userInfo && (
      <div>
        {/* <NavHeader langOptions={langOptions} navLinks={navLinks} /> */}
        {successBanner && (
          <div className="bg-[#57A04B] py-2 flex justify-between">
            <span className="text-white font-light xl:pl-[10rem] pl-4">
              {t("success_message")}
            </span>
            <img
              src="assets/images/close_icon.svg"
              alt="close"
              className="xl:mr-[5rem] hover:cursor-pointer mr-4"
              onClick={handleCross}
            />
          </div>
        )}
        <div className="pt-2 flex">
          <div className="relative pr-[4rem] hidden lg:block">
            <img src="assets/images/mask.svg" className="relative" alt="mask" />
            <img
              src="assets/images/bank.svg"
              className="absolute top-[13%] left-[3%] xl:w-auto w-[550px]"
              alt="bank"
            />
          </div>
          <div className="lg:px-[4rem] m-auto lg:py-0 py-6 px-4">
            <div className="text-[2.5rem] xl:w-[100%] m-auto xl:m-0 font-bold">
              {t("get_started")}
              <p>{userInfo.name}</p>
            </div>
            <p className="my-3 font-semibold text-[1.5rem]">{t("subtext")}</p>
            <div className="mt-4 mb-[3rem] text-[#5A7184] font-semibold">
              {t("loan_upto")}
              <span className="text-[#6006A8]">{t("amount")}</span>
            </div>
            <button
              type="button"
              className="bg-[#6006A8] py-3 sm:px-[8rem] px-[5rem] rounded-md text-white"
              onClick={handleLoan}
            >
              {t("apply_loan")}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Loan;
