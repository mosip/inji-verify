import { useState } from "react";
import ResultSummary from "./ResultSummary";
import { useVerificationFlowSelector } from "../../../../redux/features/verification/verification.selector";
import DisplayVcDetailsModal from "./DisplayVcDetailsModal";
import DisplayVcDetailView from "./DisplayVcDetailView";
import { Button } from "../commons/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../redux/hooks";
import {
  qrReadInit,
  verificationComplete,
} from "../../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../../redux/features/alerts/alerts.slice";
import { QRCodeVerification } from "@mosip/react-inji-verify-sdk";

const Result = () => {
  const { vc, vcStatus } = useVerificationFlowSelector(
    (state) => state.verificationResult ?? { vc: null, vcStatus: null }
  );
  const { method } = useVerificationFlowSelector((state) => ({
    method: state.method,
  }));
  const [isModalOpen, setModalOpen] = useState(false);
  const credentialType: string = vc.type[1];
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleVerifyAnotherQrCode = () => {
    if (method === "SCAN") {
      dispatch(qrReadInit({ method: "SCAN" }));
    } else {
      document.getElementById("verify-another-qrcode")?.click();
    }
  };

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
          <QRCodeVerification
            triggerElement={
              <Button
                title={t("Common:Button.verifyAnotherQrCode")}
                onClick={handleVerifyAnotherQrCode}
                className="mx-auto mt-6 mb-20 lg:mb-6 lg:w-[339px]"
              />
            }
            verifyServiceUrl={window._env_.VERIFY_SERVICE_API_URL}
            disableScan
            onVCProcessed={(data: { vc: unknown; vcStatus: string }[]) =>
              dispatch(verificationComplete({ verificationResult: data[0] }))
            }
            uploadButtonId={"verify-another-qr-code-button"}
            uploadButtonStyle="hidden"
            onError={(error) =>
              raiseAlert({ message: error.message, severity: "error" })
            }
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
