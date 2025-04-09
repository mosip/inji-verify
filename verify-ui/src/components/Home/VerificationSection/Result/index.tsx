import { useState } from "react";
import ResultSummary from "./ResultSummary";
import { useVerificationFlowSelector } from "../../../../redux/features/verification/verification.selector";
import DisplayVcDetailsModal from "./DisplayVcDetailsModal";
import DisplayVcDetailView from "./DisplayVcDetailView";
import { Button } from "../commons/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../redux/hooks";
import { goToHomeScreen, qrReadInit } from "../../../../redux/features/verification/verification.slice";
import { delayUploadQrCode } from "../../../../utils/commonUtils";

const Result = () => {
  const { vc, vcStatus } = useVerificationFlowSelector((state) => state.verificationResult ?? { vc: null, vcStatus: null });
  const { method } = useVerificationFlowSelector((state) => ({ method: state.method }));
  const [isModalOpen, setModalOpen] = useState(false);
  const credentialType: string = vc.type[1];
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleVerifyAnotherQrCode = () => {
    if (method === "SCAN") {
      dispatch(qrReadInit({ method: "SCAN" }));
    } else {
      dispatch(goToHomeScreen({ method: "UPLOAD" }));
      delayUploadQrCode();
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
          <Button
            id="verify-another-qr-code-button"
            title={t("Common:Button.verifyAnotherQrCode")}
            onClick={handleVerifyAnotherQrCode}
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
