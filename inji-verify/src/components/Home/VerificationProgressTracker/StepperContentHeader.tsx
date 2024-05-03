import React from 'react';

function StepperContentHeader(props: any) {
    return (
        <div>
            <h4 className="mx-0 my-1.5 font-bold text-[26px] font-inter">
                Verify your credentials in <span className={"text-[#FF7F00]"}>4 easy steps</span>
            </h4>
            <p className="mx-0 my-1.5 text-[16px] font-normal font-inter">
                Credentials are digitally signed documents with tamper-evident QR codes. These QR codes can be easily
                verified using the Inji Verify app. Simply scan the QR code with your smartphone camera or use the
                dedicated verification tool on this page.
            </p>
        </div>
    );
}

export default StepperContentHeader;