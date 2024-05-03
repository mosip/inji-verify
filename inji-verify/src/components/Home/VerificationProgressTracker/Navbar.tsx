import React from 'react';
import injiLogo from "../../../assets/inji-logo.svg";

function Navbar(props: any) {
    // Logo goes here
    return (
        <div className={"h-[52px] mx-0 mt-[46px] mb-[60px]"}>
            <img src={injiLogo}/>
        </div>
    );
}

export default Navbar;
