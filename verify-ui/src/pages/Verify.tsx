import React from "react";
import PageTemplate from "../components/PageTemplate";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import { VpVerification } from "../components/Home/VerificationSection/VpVerification";
import { Button } from "../components/Home/VerificationSection/commons/Button";
import { useTranslation } from "react-i18next";
import { useVerifyFlowSelector } from "../redux/features/verification/verification.selector";
import { getVpRequest, resetVpRequest, setSelectedClaims } from "../redux/features/verify/vpVerificationState";
import { useAppDispatch } from "../redux/hooks";

export function Verify() {
  const { t } = useTranslation("Verify");
  const txnId = useVerifyFlowSelector((state) => state.txnId);
  const dispatch = useAppDispatch();
  const unverifiedClaims = useVerifyFlowSelector((state) => state.unVerifiedClaims );

  const handleRequestCredentials = () => {
    dispatch(resetVpRequest());
  };

  const HandelGenerateQr = () => {
    dispatch(setSelectedClaims({selectedClaims: unverifiedClaims}));
    dispatch(getVpRequest({ selectedClaims: unverifiedClaims }));
  };

  const HandelRestartProcess = () => {
    dispatch(resetVpRequest());
  };

  const renderRequestCredentialsButton = () => (
    <Button
      id="request-credentials-button"
      title={t("rqstButton")}
      className={`w-[300px] mx-auto lg:ml-[76px] mt-10 hidden lg:block`}
      fill
      onClick={handleRequestCredentials}
      disabled={txnId !== ""}
    />
  );

  const renderMissingAndResetButton = () => (
    <div className="hidden lg:flex items-center justify-around mt-10">
      <Button
        id="missing-credentials-button"
        title={t("missingCredentials")}
        className={`w-[250px]`}
        fill
        onClick={HandelGenerateQr}
      />
      <Button
        id="restart-process-button"
        title={t("restartProcess")}
        className={`w-[200px]`}
        onClick={HandelRestartProcess}
      />
    </div>
  );


  return (
    <PageTemplate>
      <div className="grid grid-cols-13">
        <div className="col-start-1 col-end-13 lg:col-end-6 lg:bg-pageBackGroundColor xs:w-[100vw] lg:max-w-[50vw] lg:pb-[100px]">
          <VerificationProgressTracker />
        </div>
        <div className="col-start-1 col-end-13 lg:col-start-7 xs:w-[100vw] lg:max-w-[50vw]">
          <VpVerification />
        </div>
      </div>
    </PageTemplate>
  );
}
