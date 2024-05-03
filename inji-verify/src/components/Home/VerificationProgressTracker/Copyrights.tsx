import React from "react";

function Copyrights(props: any) {
    return (
        <div className="fixed grid bottom-0 xs:w-[100vw] md:w-[50vw] content-center justify-center bg-white">
            <div className="xs:w-[90vw] md:w-[40vw] mx-auto border-b-[1px] border-b-[#707070] opacity-20"/>
            <p className="py-4 px-0 w-[100%] text-center text-[14px] font-inter font-normal text-[#707070]">
                2024 © MOSIP - All rights reserved.
            </p>
        </div>
    );
}

export default Copyrights;
