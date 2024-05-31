import React from 'react';
import VerificationMethodTabs from "./VerificationMethodTabs";

function Header(props: any) {
    return (
        <div>
            <div className="w-[100%] bg-[#F2FCFF] py-[26px] md:py-9 max-w-[100vw] text-center">
                <p className="mx-auto my-1.5 font-bold text-[19px] md:text-[26px] max-w-[80vw]">
                    Verify credentials <span className="text-primary">with ease!</span>
                </p>
                <p className="mx-auto my-1.5 text-[14px] md:text-[16px] font-normal px-[22px] md:max-w-[624px]">
                    Effortlessly verify credentials with Inji Verify! Just scan the QR code or upload it for instant validation, following the steps below.
                </p>
            </div>
            <VerificationMethodTabs/>
        </div>
    );
}

export default Header;
