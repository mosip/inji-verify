import React from 'react';
import VerificationMethodTabs from "./VerificationMethodTabs";

function Header(props: any) {
    return (
        <div>
            <div className="w-full bg-headerBackGround py-[26px] lg:py-9 max-w-[100vw] text-center">
                <p id="verify-credentials-heading" className="mx-auto my-1.5 font-bold text-boldTextSize lg:text-lgBoldTextSize max-w-[80vw] text-[#42307D]">
                Verify Truck Pass 
                </p>
                <p id="verify-credentials-description" className="mx-auto my-1.5 text-[#6941C6] text-normalTextSize lg:text-lgNormalTextSize font-normal px-[22px] lg:max-w-[624px]">
                Effortlessly verify credentials with TruckPass Portal! Just scan the QR code or upload it for instant validation, following the steps below.
                </p>
            </div>
            <VerificationMethodTabs/>
        </div>
    );
}

export default Header;
