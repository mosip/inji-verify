import React, { useState } from "react";
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
  const [openSelection, setSelection] = useState(false);
  const { t } = useTranslation("Verify");
  const txnId = useVerifyFlowSelector((state) => state.txnId);
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
              setSelection(!openSelection);
              dispatch(setSelectCredential());
            }}
            disabled={txnId !== ""}
          />
          {
            <SelectionPannel
              open={openSelection}
              handleClose={() => setSelection(!openSelection)}
            />
          }
        </div>
        <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
          <VpVerification />
        </div>
      </div>
    </PageTemplate>
  );
}
