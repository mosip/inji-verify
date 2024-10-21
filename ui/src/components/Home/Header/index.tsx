import React from 'react';
import VerificationMethodTabs from "./VerificationMethodTabs";

function Header(props: any) {
    return (
        <div>
            <div className="w-full bg-lighter-gradient py-[26px] lg:py-9 max-w-[100vw] text-center">
                <p id="verify-credentials-heading" className="mx-auto my-1.5 font-bold text-lgMediumTextSize lg:text-lgBoldTextSize max-w-[80vw] text-headerLabelText">
                    Verify credentials <span id="heading-highlighted-content" className="bg-gradient bg-clip-text text-transparent lg:text-lgBoldTextSize font-bold">with ease!</span>
                </p>
                <p id="verify-credentials-description" className="mx-auto my-1.5 text-headerDescriptionText text-normalTextSize lg:text-lgNormalTextSize font-normal px-[22px] lg:max-w-[624px]">
                    Effortlessly verify credentials with Inji Verify! Just scan the QR code or upload it for instant validation, following the steps below.
                </p>
            </div>
            <VerificationMethodTabs/>
        </div>
    );
}

export default Header;
