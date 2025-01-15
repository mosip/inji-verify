import React from "react";
import ResultSummary from "./ResultSummary";
import { claim, VpSubmissionResultInt } from "../../../../types/data-types";
import VpVerifyResultSummary from "./VpVerifyResultSummary";
import DisplayVcCardView from "./DisplayVcCardView";
import { Button } from "../commons/Button";
import { t } from "i18next";
import DisplayUnVerifiedVc from "./DisplayUnVerifiedVc";

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
  const renderRequestCredentialsButton = (propClasses = "") => (
    <Button
      id="request-credentials-button"
      title={t("Verify:rqstButton")}
      className={`w-[300px] mt-4 mb-[100px] lg:ml-[76px] lg:hidden ${propClasses}`}
      fill
      onClick={requestCredentials}
      disabled={txnId !== ""}
    />
  );

  const renderMissingAndResetButton = () => (
    <div className="flex items-center justify-around mt-10 lg:hidden">
      <Button
        id="missing-credentials-button"
        title={t("missingCredentials")}
        className={`w-[250px]`}
        fill
        onClick={reGenerateQr}
      />
      <Button
        id="restart-process-button"
        title={t("restartProcess")}
        className={`w-[200px]`}
        onClick={restart}
      />
    </div>
  );
  const isPartiallyShared = unverifiedClaims.length > 0;

  return (
    <div className="space-y-6">
      {isSingleVc ? (
        <ResultSummary status={vcStatus} />
      ) : (
        <VpVerifyResultSummary
          verifiedVcs={[...verifiedVcs]}
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
          {!isSingleVc &&
            unverifiedClaims.map((claim) => <DisplayUnVerifiedVc claim={claim} />)}
        </div>
      </div>

      <div className="flex justify-center">
        {isPartiallyShared
          ? renderMissingAndResetButton()
          : renderRequestCredentialsButton()}
      </div>
    </div>
  );
};

export default VpSubmissionResult;