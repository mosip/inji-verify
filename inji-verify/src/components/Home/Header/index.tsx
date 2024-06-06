import React from 'react';
import VerificationMethodTabs from "./VerificationMethodTabs";

function Header(props: any) {
    return (
        <div>
            <div className="w-full bg-[#F2FCFF] py-[26px] lg:py-9 max-w-[100vw] text-center">
                <p id="verify-credentials-heading" className="mx-auto my-1.5 font-bold text-[19px] lg:text-[26px] max-w-[80vw]">
                    Verify credentials <span id="heading-highlighted-content" className="text-primary">with ease!</span>
                </p>
                <p id="verify-credentials-description" className="mx-auto my-1.5 text-[14px] lg:text-[16px] font-normal px-[22px] lg:max-w-[624px]">
                    Effortlessly verify credentials with Inji Verify! Just scan the QR code or upload it for instant validation, following the steps below.
                </p>
            </div>
            <VerificationMethodTabs/>
        </div>
    );
}

export default Header;
