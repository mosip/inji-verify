import React from "react";
import { useTranslation } from "react-i18next";
import { InjiLogo } from "../../utils/theme-utils";

function Copyrights(props: any) {
    const {t} = useTranslation("CopyRight");

    return (
        <div className="fixed grid bottom-0 w-[100vw] lg:w-[49vw] content-center justify-center bg-white">
            <div className="xs:w-[90vw] lg:w-[40vw] mx-auto border-b-[1px] border-b-copyRightsBorder opacity-20"/>
            <div className="py-4 px-0 w-[100%] flex justify-center content-center">
                <InjiLogo className="mr-2"/>
                <p id="copyrights-content" className="text-center text-normalTextSize font-normal text-copyRightsText">
                    {t('content')}
                </p>
            </div>
            
        </div>
    );
}

export default Copyrights;
