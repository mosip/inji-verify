import React from 'react';
import SomethingWentWrong from "../components/SomethingWentWrong";

function Offline(props: any) {
    return (
        <div className="py-[46px] px-[15px] lg:px-[80px] bg-[#FAFBFD] bg-no-repeat h-[100%]">
            <img id="inji-verify-logo" src='/assets/images/inji_verify.svg' alt="inji-verify-logo"/>
            <SomethingWentWrong/>
        </div>
    );
}

export default Offline;
