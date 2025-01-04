import React from "react";
import PageTemplate from "../components/PageTemplate";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import { VpVerification } from "../components/Home/VerificationSection/VpVerification";
import SelectionPannel from "../components/Home/VerificationSection/commons/SelectionPannel";
import { Button } from "../components/Home/VerificationSection/commons/Button";
import { useTranslation } from "react-i18next";
import { useVerifyFlowSelector } from "../redux/features/verification/verification.selector";
import {
  getVpRequest,
  resetVpRequest,
  setSelectCredential,
} from "../redux/features/verify/vpVerificationState";
import { useAppDispatch } from "../redux/hooks";

export function Verify() {
  const { t } = useTranslation("Verify");
  const txnId = useVerifyFlowSelector((state) => state.txnId);
  const openSelection = useVerifyFlowSelector((state) => state.SelectionPannel);
  const verifiedVcs = useVerifyFlowSelector(
    (state) => state.verificationSubmissionResult
  );
  const dispatch = useAppDispatch();

  const handleRequestCredentials = () => {
    dispatch(setSelectCredential());
  };

  const HandelGenerateQr = () => {
    dispatch(getVpRequest({ selectedClaims: unverifiedClaims }));
  };

  const HandelRestartProcess = () => {
    dispatch(resetVpRequest());
  };

  const unverifiedClaims = useVerifyFlowSelector(
    (state) => state.unVerifiedClaims
  );
  const isPartiallyShared = unverifiedClaims.length > 0;

  const renderRequestCredentialsButton = () => (
    <Button
      id="request-credentials-button"
      title={t("rqstButton")}
      className={`w-[300px] mx-auto lg:ml-[76px] mt-10`}
      fill
      onClick={handleRequestCredentials}
      disabled={txnId !== ""}
    />
  );

  const renderMissingAndResetButton = () => (
    <div className="flex items-center justify-around mt-10">
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

  const isLargeScreen = window.innerWidth >= 1024;

  return (
    <PageTemplate>
      <div className="grid grid-cols-13">
        <div className="col-start-1 col-end-13 lg:col-end-6 lg:bg-pageBackGroundColor xs:w-[100vw] lg:max-w-[50vw] lg:pb-[100px]">
          <VerificationProgressTracker />
          {isLargeScreen && isPartiallyShared
            ? renderMissingAndResetButton()
            : renderRequestCredentialsButton()}
          {openSelection && <SelectionPannel />}
        </div>
        <div className="col-start-1 col-end-13 lg:col-start-7 xs:w-[100vw] lg:max-w-[50vw]">
          <VpVerification />
        </div>
      </div>
    </PageTemplate>
  );
}
