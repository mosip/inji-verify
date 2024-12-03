import React, { useEffect, useState } from "react";
import { QrIcon } from "../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import Loader from "../../commons/Loader";
import { QrCodeExpiry } from "../../../utils/config";
import { useTranslation } from "react-i18next";
import { QrCode } from "../../commons/QrCode";
import VpSubmissionResult from "./Result/VpSubmissionResult";

const DisplayActiveStep = (loc: string) => {
  const { t } = useTranslation("Verify");
  const [timeLeft, setTimeLeft] = useState(QrCodeExpiry);
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const qrData = useVerifyFlowSelector((state) => state.qrData);
  const status = useVerifyFlowSelector((state) => state.status);
  const qrSize = window.innerWidth <= 1024 ? 240 : 320;

  useEffect(() => {
    if (qrData) {
      setTimeLeft(QrCodeExpiry);
    }
  }, [qrData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (isLoading) {
    return <Loader className="relative lg:top-[200px]" />;
  } else if (status === "COMPLETED") {
    return (
      <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
        <VpSubmissionResult loc={loc}/>
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
              <div className={`grid bg-${window._env_.DEFAULT_THEME}-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center`}></div>
              <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                <QrIcon className="w-[78px] lg:w-[100px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (qrData) {
    const qrFooter =
      status === "EXPIRED"
        ? "QR Code Expired"
        : `Valid for ${formatTime(timeLeft)}`;
    return (
      <QrCode
        title={t("qrCodeInfo")}
        data={qrData}
        size={qrSize}
        status={status}
        footer={qrFooter}
      />
    );
  }
};

export type displayProps = {
  loc: string;
};

export const VpVerification = (props: displayProps) => {
  return <div>{DisplayActiveStep(props.loc)}</div>;
};
