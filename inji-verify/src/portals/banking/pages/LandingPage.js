import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clientDetails from "../constants/clientDetails";
import { useExternalScript } from "../hooks/useExternalScript";

const LandingPage = () => {
  
  const { i18n, t } = useTranslation("landing_page");
  const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
  const state = useExternalScript(signInButtonScript);

  useEffect(() => {
    renderSignInButton();
  }, [state]);

  const renderSignInButton = () => {
    const oidcConfig = {
      authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
      redirect_uri: clientDetails.redirect_uri_userprofile,
      client_id: clientDetails.clientId,
      scope: clientDetails.scopeUserProfile,
      nonce: clientDetails.nonce,
      state: clientDetails.state,
      acr_values: clientDetails.acr_values,
      claims_locales: clientDetails.claims_locales,
      display: clientDetails.display,
      prompt: clientDetails.prompt,
      max_age: clientDetails.max_age,
      ui_locales: i18n.language,
      claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
    };

    window.SignInWithEsignetButton?.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        shape: "soft_edges",
        labelText: t("sign_in_with_esignet"),
        width: "100%",
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  };

  localStorage.removeItem("userInfo");

  return (
    <div>
      <div className="pt-2 flex font-semibold">
        <div className="relative pr-[4rem] hidden lg:block">
          <img src="assets/images/mask.svg" className="relative" />
          <img
            src="assets/images/bank.svg"
            alt="bank"
            className="absolute top-[13%] left-[3%] xl:w-auto w-[550px]"
          />
        </div>
        <div className="xl:pl-[4rem] xl:pt-[2rem] pt-0 px-4 lg:m-0 m-auto">
          <p className="font-bold text-[36px] ">
            {t("sign_in_to_banking_portal")}
          </p>
          <div className="lg:w-full pt-[1rem] lg:m-0 m-auto">
            <form className="my-6">
              <label className="my-3 block text-[#5A7184]">
                {t("username")}
              </label>
              <input type="text" className="input-box py-2 px-4 w-full mb-6" placeholder={t("username_placeholder")}/>
              <label className="mb-3 block mt-6 text-[#5A7184]">
                {t("password")}
              </label>
              <input type="text" className="input-box py-2 px-4 w-full" placeholder={t("password_placeholder")}/>
              <div className="flex justify-between my-[1.75rem] text-sm">
                <div>
                  <input
                    type="checkbox"
                    id="signin"
                    className="text-md scale-125 relative top-[1.5px] mr-1"
                  />
                  <label for="signin" className="mx-0 text-[#5A7184]">
                    {" "}
                    {t("keep_me_sign_in")}{" "}
                  </label>
                </div>
                <a href="" className="text-[#7F56D9]">
                  {t("forgot_password")}
                </a>
              </div>
              <button
                type="submit"
                className="bg-[#6006A8] text-white w-full py-3 rounded-md mb-3 font-semibold"
              >
                {t("submit")}
              </button>
              <div className="flex my-4">
                <img src="assets/images/line.svg" className="sm:w-[50%] w-[45%]" alt="line"/>
                <span className="mx-1">{t("or")}</span>
                <img src="assets/images/line.svg" className="sm:w-[50%] w-[45%]" alt="line"/>
              </div>
            </form>
            <div>
              {state === "ready" && (
                <div id="sign-in-with-esignet" className="w-full"></div>
              )}
            </div>
            <p className="text-sm my-[1.75rem]">
              <span className="text-[#5A7184] mr-2">{t("no_account")}</span>
              <a href="" className="text-[#7F56D9]">
                {t("sign_up")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
