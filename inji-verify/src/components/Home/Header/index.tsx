import React from 'react';
import VerificationMethodTabs from "./VerificationMethodTabs";
import { useTranslation } from 'react-i18next';

function Header(props: any) {
    const {t} = useTranslation('Header')

    return (
        <div>
            <div className="w-full bg-[#F2FCFF] py-[26px] lg:py-9 max-w-[100vw] text-center">
                <p id="verify-credentials-heading" className="mx-auto my-1.5 font-bold text-[19px] lg:text-[26px] max-w-[80vw]">
                   {t("heading")} <span id="heading-highlighted-content" className="text-primary">{t("headingHighlight")}</span>
                </p>
                <p id="verify-credentials-description" className="mx-auto my-1.5 text-[14px] lg:text-[16px] font-normal px-[22px] lg:max-w-[624px]">
                {t("description")}
                </p>
            </div>
            <VerificationMethodTabs/>
        </div>
    );
}

export default Header;
