import React from "react";
import { QrIcon } from "../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import Loader from "../../commons/Loader";
import { useTranslation } from "react-i18next";
import { QrCode } from "../../commons/QrCode";
import VpSubmissionResult from "./Result/VpSubmissionResult";

const DisplayActiveStep = () => {
  const { t } = useTranslation("Verify");
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const qrData = useVerifyFlowSelector((state) => state.qrData);
  const status = useVerifyFlowSelector((state) => state.status);
  const qrSize = window.innerWidth <= 1024 ? 240 : 320;
  const { vc, vcStatus } = useVerifyFlowSelector(state => state.verificationSubmissionResult ?? { vc: null, vcStatus: null })

  if (isLoading) {
    return <Loader className="relative lg:top-[200px]" />;
  } else if (vc) {
    return (
      <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
        <VpSubmissionResult vc={vc} vcStatus={vcStatus} />
      </div>
    );
  } else if (!qrData) {
    return (
      <div className="flex flex-col mt-10 lg:mt-0 pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
        <div className="xs:col-end-13">
          <div
            className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`grid bg-${window._env_.DEFAULT_THEME}-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center`}
              ></div>
              <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                <QrIcon className="w-[78px] lg:w-[100px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (qrData)
    return (
      <QrCode
        title={t("qrCodeInfo")}
        data={qrData}
        size={qrSize}
        status={status}
      />
    );
};

export const VpVerification = () => {
  return <div>{DisplayActiveStep()}</div>;
};
