import React from "react";

function Copyrights(props: any) {
    return (
        <div className="fixed grid bottom-0 w-[100vw] lg:w-[49vw] content-center justify-center bg-white">
            <div className="xs:w-[90vw] lg:w-[40vw] mx-auto border-b-[1px] border-b-[#707070] opacity-20"/>
            <p className="py-4 px-0 w-[100%] text-center text-[14px]  font-normal text-[#707070]">
                2024 © MOSIP - All rights reserved.
            </p>
        </div>
    );
}

export default Copyrights;
