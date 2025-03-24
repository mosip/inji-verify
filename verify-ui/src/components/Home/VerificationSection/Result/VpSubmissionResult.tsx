import React from "react";
import ResultSummary from "./ResultSummary";
import { claim, VpSubmissionResultInt } from "../../../../types/data-types";
import VpVerifyResultSummary from "./VpVerifyResultSummary";
import DisplayVcCardView from "./DisplayVcCardView";
import { Button } from "../commons/Button";
import { t } from "i18next";
import DisplayUnVerifiedVc from "./DisplayUnVerifiedVc";
import { useVerifyFlowSelector } from "../../../../redux/features/verification/verification.selector";

type VpSubmissionResultProps = {
  verifiedVcs: VpSubmissionResultInt[];
  unverifiedClaims: claim[];
  txnId: string;
  requestCredentials: () => void;
  reGenerateQr: () => void;
  restart: () => void;
  isSingleVc: boolean;
};

const VpSubmissionResult: React.FC<VpSubmissionResultProps> = ({
  verifiedVcs,
  unverifiedClaims,
  txnId,
  requestCredentials,
  reGenerateQr,
  restart,
  isSingleVc,
}) => {
  const { vcStatus } = verifiedVcs[0];
  const selectedClaims: claim[] = useVerifyFlowSelector((state) => state.selectedClaims) || [];
  const isPartiallyShared = useVerifyFlowSelector((state) => state.isPartiallyShared );

  const renderRequestCredentialsButton = (propClasses = "") => (
    <div className={`flex flex-col items-center lg:hidden ${propClasses}`}>
      <Button
        id="request-credentials-button"
        title={t("Verify:rqstButton")}
        className={`w-[339px] mt-5`}
        fill
        onClick={requestCredentials}
        disabled={txnId !== ""}
      />
    </div>
  );

  const renderMissingAndResetButton = () => (
    <div className="flex flex-col items-center lg:hidden">
      <Button
        id="missing-credentials-button"
        title={t("missingCredentials")}
        className={`w-[339px] mt-5`}
        fill
        onClick={reGenerateQr}
      />
      <Button
        id="restart-process-button"
        title={t("restartProcess")}
        className={`w-[341px] mt-5`}
        onClick={restart}
      />
    </div>
  );
  const filterVerifiedVcs = verifiedVcs.filter((verifiedVc) =>
    selectedClaims.some(
      (selectedVc) =>
        verifiedVc.vc.credentialConfigurationId === selectedVc.type
    )
  );

  return (
    <div className="space-y-6 mb-[100px] lg:mb-0">
      {isSingleVc ? (
        <ResultSummary status={vcStatus} />
      ) : (
        <VpVerifyResultSummary
          verifiedVcs={[...filterVerifiedVcs]}
          unverifiedClaims={unverifiedClaims}
        />
      )}
      <div className="relative">
        <div className="flex flex-col items-center space-y-4 lg:space-y-6 mt-[-60px] lg:mt-[-70px]">
          {verifiedVcs.map(({ vc, vcStatus }, index) => (
            <DisplayVcCardView
              key={index}
              vc={vc}
              vcStatus={vcStatus}
              view={isSingleVc}
            />
          ))}
          {unverifiedClaims.map((claim,index) => (
            <DisplayUnVerifiedVc key={index} claim={claim} />
          ))}
        </div>
      </div>

      {isPartiallyShared
        ? renderMissingAndResetButton()
        : renderRequestCredentialsButton()}
    </div>
  );
};

export default VpSubmissionResult;