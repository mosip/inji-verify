import React from 'react';
import injiLogo from '../assets/inji-logo.svg';
import SomethingWentWrong from "../components/SomethingWentWrong";

function Offline(props: any) {
    return (
        <div className="py-[46px] px-[80px] bg-[#FAFBFD] bg-no-repeat h-[100%]">
            <img src='/assets/images/inji_verify.svg'/>
            <SomethingWentWrong/>
        </div>
    );
}

export default Offline;