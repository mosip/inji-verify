import React from "react";
import PageTemplate from "../components/PageTemplate";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import { VpVerification } from "../components/Home/VerificationSection/VpVerification";
import SelectionPannel from "../components/Home/VerificationSection/commons/SelectionPannel";
import { Button } from "../components/Home/VerificationSection/commons/Button";
import { useTranslation } from "react-i18next";
import { useVerifyFlowSelector } from "../redux/features/verification/verification.selector";
import { setSelectCredential } from "../redux/features/verify/verifyState";
import { useAppDispatch } from "../redux/hooks";

export function Verify() {
  const { t } = useTranslation("Verify");
  const txnId = useVerifyFlowSelector((state) => state.txnId);
  const openSelection = useVerifyFlowSelector((state) => state.SelectionPannel);
  const dispatch = useAppDispatch();

  return (
    <PageTemplate>
      <div className="grid grid-cols-12">
        <div className="col-start-1 col-end-13 lg:col-span-6 lg:bg-pageBackGroundColor xs:w-[100vw] lg:max-w-[50vw] pb-[100px]">
          <VerificationProgressTracker />
          <Button
            id="request-credentials-button"
            title={t("rqstButton")}
            className="w-[300px] mt-10 mx-auto lg:ml-[76px]"
            fill
            onClick={() => {
              dispatch(setSelectCredential());
            }}
            disabled={txnId !== ""}
          />
          {openSelection && <SelectionPannel />}
        </div>
        <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
          <VpVerification loc={window.location.href}/>
        </div>
      </div>
    </PageTemplate>
  );
}
