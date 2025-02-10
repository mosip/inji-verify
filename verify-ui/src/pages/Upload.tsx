import React from "react";
import { QrIcon } from "../utils/theme-utils";
import { UploadQrCode } from "../components/Home/VerificationSection/UploadQrCode";
import { ScanOutline } from "../utils/theme-utils";
import { useTranslation } from "react-i18next";

export const Upload = () => {
  const {t} = useTranslation('Upload')
  return (
    <div className="flex flex-col pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
      <div className="xs:col-end-13">
        <div
          className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto bg-cover`}
          style={{ backgroundImage: `url(${ScanOutline})` }}
        >
          <div className={`grid bg-${window._env_.DEFAULT_THEME}-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center`}></div>
          <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
            <QrIcon className="w-[78px] lg:w-[100px]" />
          </div>
          <UploadQrCode
            className="absolute top-[160px] left-[33px] w-[205px] lg:w-[223px] lg:left-[63px] lg:top-[231px]"
            displayMessage={t("Common:Button.upload")}
          />
        </div>
        <div className="grid text-center content-center justify-center pt-2">
          <p
            id="file-format-constraints"
            className="font-normal text-normalTextSize text-uploadDescription w-[280px]"
          >
           {t('format')}
          </p>
        </div>
      </div>
    </div>
  );
};
