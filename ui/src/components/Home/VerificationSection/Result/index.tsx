import React, { useState } from "react";
import ResultSummary from "./ResultSummary";
import { useVerificationFlowSelector } from "../../../../redux/features/verification/verification.selector";
import DisplayVcDetailsModal from "./DisplayVcDetailsModal";
import DisplayVcDetailView from "./DisplayVcDetailView";
import { Button } from "../commons/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../redux/hooks";
import { goToHomeScreen } from "../../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../../redux/features/alerts/alerts.slice";
import { AlertMessages } from "../../../../utils/config";
import { api } from "../../../../utils/api";

const Result = () => {
  const { vc, vcStatus } = useVerificationFlowSelector(
    (state) => state.verificationResult ?? { vc: null, vcStatus: null }
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const credentialType: string = vc.type[1];
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isPopulating, setIsPopulating] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(false);
  
  const populateGoogleSheet = async () => {
    if (!vc) {
      alert("VC data is not available.");
      return;
    }

    setIsPopulating(true);

    try {
      const rowData = {
        fullName: vc.credentialSubject.fullName || "",
        email: vc.credentialSubject.email || "",
        organisation: vc.credentialSubject.organisation || "",
        designation: vc.credentialSubject.designation || "",
        timestamp: Date.now() || "",
      };

      const apiRequest = api.fetchCheckIn;
      apiRequest.body = JSON.stringify(rowData);
      const requestOptions = {
        method: apiRequest.methodType,
        headers: apiRequest.headers(),
        body: apiRequest.body,
      };

      await fetch(apiRequest.url(), requestOptions);
      setIsCheckIn(true);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      dispatch(raiseAlert({ ...AlertMessages().unexpectedError, open: true }));
    } finally {
      setIsPopulating(false);
    }
  };

  // validate vc and show success/failure component
  return (
    <div id="result-section" className="relative mb-[100px]">
      <div className={`text-whiteText`}>
        <ResultSummary status={vcStatus} />
      </div>
      <div>
        <div className={`h-[3px] border-b-2 border-b-transparent`} />
        <DisplayVcDetailView
          vc={vc}
          onExpand={() => setModalOpen(true)}
          className={`h-auto rounded-t-0 rounded-b-lg overflow-y-auto mt-[-30px]`}
        />
        <div className="grid content-center justify-center">
          {vc.type[1].includes("InvitationPass") && (
            <Button
              id="verify-another-qr-code-button"
              title={t("Common:Button.checkIn")}
              disabled={isCheckIn || isPopulating || vcStatus !== "SUCCESS"}
              onClick={populateGoogleSheet}
              className="mt-1 mb-2 lg:mb-1 lg:w-[339px]"
            />
          )}

          <Button
            id="verify-another-qr-code-button"
            title={t("Common:Button.verifyAnotherQrCode")}
            onClick={() => dispatch(goToHomeScreen({}))}
            disabled={
              vcStatus === "SUCCESS" &&
              vc.type[1].includes("InvitationPass") &&
              !isCheckIn
            }
            className="mx-auto mt-6 mb-20 lg:mb-6 lg:w-[339px]"
          />
        </div>
      </div>
      <DisplayVcDetailsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        vc={vc}
        status={vcStatus}
        vcType={credentialType}
      />
    </div>
  );
};

export default Result;
