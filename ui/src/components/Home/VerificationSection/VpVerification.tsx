import React, { useEffect, useState } from "react";
import { QrIcon } from "../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import Loader from "../../commons/Loader";
import { QrCodeExpiry } from "../../../utils/config";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../redux/hooks";
import { resetVpRequest } from "../../../redux/features/verify/verifyState";
import { Button } from "./commons/Button";
import { QrCode } from "../../commons/QrCode";
import VpSubmissionResult from "./Result/VpSubmissionResult";

const DisplayActiveStep = () => {
  const { t } = useTranslation("Verify");
  const [timeLeft, setTimeLeft] = useState(QrCodeExpiry);
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const qrData = useVerifyFlowSelector((state) => state.qrData);
  const status = useVerifyFlowSelector((state) => state.status);
  const qrSize = window.innerWidth <= 1024 ? 240 : 320;
  const dispatch = useAppDispatch();
  const ReGenerateQrCode = () => {
    dispatch(resetVpRequest());
    setTimeLeft(QrCodeExpiry);
  };
  useEffect(() => {
    if (timeLeft > 0 && qrData) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [dispatch, qrData, timeLeft]);

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
  } else if (status === "EXPIRED") {
    return (
      <div className="flex flex-col mt-10 lg:mt-0 pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
        <div className="xs:col-end-13">
          <div
            className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto`}
          >
            <div className="flex flex-col items-center">
              <div className="grid bg-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center"></div>
              <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                <QrIcon className="w-[78px] lg:w-[100px]" />
              </div>
              <Button
                title={"Generate New QR Code"}
                className="absolute lg:bottom-[70px] w-[300px] mt-10 mx-auto"
                onClick={ReGenerateQrCode}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (!qrData && status !== "PENDING") {
    return (
      <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
        <VpSubmissionResult />
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
              <div className="grid bg-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center"></div>
              <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                <QrIcon className="w-[78px] lg:w-[100px]" />
              </div>
              {timeLeft === 0 && (
                <Button
                  title={"Generate New QR Code"}
                  className="absolute lg:bottom-[70px] w-[300px] mt-10 mx-auto"
                  onClick={ReGenerateQrCode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (qrData) {
    return (
      <QrCode
        title={t("qrCodeInfo")}
        data={qrData}
        size={qrSize}
        footer={` Valid for ${formatTime(timeLeft)}`}
      />
    );
  }
};

export const VpVerification = () => {
  return <div>{DisplayActiveStep()}</div>;
};
