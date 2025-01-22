import React from "react";
import { QrIcon } from "../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import Loader from "../../commons/Loader";
import { useTranslation } from "react-i18next";
import { QrCode } from "../../commons/QrCode";
import VpSubmissionResult from "./Result/VpSubmissionResult";
import { useAppDispatch } from "../../../redux/hooks";
import { getVpRequest, resetVpRequest, setSelectCredential, setSelectedClaims } from "../../../redux/features/verify/vpVerificationState";
import { VpSubmissionResultInt } from "../../../types/data-types";
import { Button } from "./commons/Button";

const DisplayActiveStep = () => {
  const { t } = useTranslation("Verify");
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const qrData = useVerifyFlowSelector((state) => state.qrData);
  const status = useVerifyFlowSelector((state) => state.status);
  const txnId = useVerifyFlowSelector((state) => state.txnId);
  const unverifiedClaims = useVerifyFlowSelector((state) => state.unVerifiedClaims);
  const selectedClaims = useVerifyFlowSelector((state) => state.selectedClaims);
  const verifiedVcs: VpSubmissionResultInt[] = useVerifyFlowSelector((state) => state.verificationSubmissionResult);
  const qrSize = window.innerWidth <= 1024 ? 240 : 320;

  const dispatch = useAppDispatch();

  const handleRequestCredentials = () => {
    dispatch(setSelectCredential());
  };

  const HandelGenerateQr = () => {
    dispatch(setSelectedClaims({selectedClaims: unverifiedClaims}));
    dispatch(getVpRequest({ selectedClaims: unverifiedClaims }));
  };
  
  const HandelRestartProcess = () => {
    dispatch(resetVpRequest());
  };

  if (isLoading) {
    return <Loader className={`absolute lg:top-[200px] right-[100px]`} />;
  } else if (verifiedVcs.length > 0) {
    const isSingleVc = selectedClaims.length === 1;
    return (
      <div className="w-[100vw] lg:w-[50vw]">
        <VpSubmissionResult
          verifiedVcs={verifiedVcs}
          unverifiedClaims={unverifiedClaims}
          txnId={txnId}
          requestCredentials={handleRequestCredentials}
          reGenerateQr={HandelGenerateQr}
          restart={HandelRestartProcess}
          isSingleVc={isSingleVc}
        />
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
              <div className="absolute top-[88px] left-[98px] lg:top-[185px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                <QrIcon className="w-[78px] lg:w-[100px]" />
              </div>
              <Button
                id="request-credentials-button"
                title={t("rqstButton")}
                className={`w-[300px] mx-auto lg:ml-[76px] mt-10 lg:hidden`}
                fill
                onClick={handleRequestCredentials}
                disabled={txnId !== ""}
              />
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
        status={status}
      />
    );
  }
};

export const VpVerification = () => {
  return <div>{DisplayActiveStep()}</div>;
};