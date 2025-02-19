import React from "react";
import VerificationMethodTabs from "./VerificationMethodTabs";
import { useTranslation } from "react-i18next";

function Header(props: any) {
  const { t } = useTranslation("Header");
  return (
    <div>
      <div className={`w-full bg-[#F9F5FF] py-[26px] lg:py-9 max-w-[100vw] text-center`}>
        <p
          id="verify-credentials-heading"
          className="mx-auto my-1.5 font-bold text-lgMediumTextSize lg:text-lgBoldTextSize max-w-[80vw] text-headerLabelText !text-[#42307D] text-[1.5em]"
        >
          {t("heading")}
          {/* <span
            id="heading-highlighted-content"
            className={`bg-${window._env_.DEFAULT_THEME}-gradient bg-clip-text text-transparent lg:text-lgBoldTextSize font-bold`}
          >
            {t("headingHighlight")}
          </span> */}
        </p>
        <p
          id="verify-credentials-description"
          className="mx-auto mt-3 text-headerDescriptionText text-normalTextSize lg:text-lgNormalTextSize font-normal lg:max-w-[624px] !text-[#6941C6] px-2 md:px-0"
        >
          {t("description")}
        </p>
      </div>
      <VerificationMethodTabs />
    </div>
  );
}

export default Header;
