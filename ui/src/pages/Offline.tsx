import React from 'react';
import SomethingWentWrong from "../components/SomethingWentWrong";
import {ReactComponent  as InjiVerifyLogo} from "../assets/images/inji-verify.svg";

function Offline(props: any) {
    return (
        <div className="py-[46px] px-[15px] lg:px-[80px] bg-[#FAFBFD] bg-no-repeat h-[100%]">
            <InjiVerifyLogo />
            <SomethingWentWrong/>
        </div>
    );
}

export default Offline;
