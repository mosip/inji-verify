import React from "react";
import ResultSummary from "./ResultSummary";
import { claims, VpSubmissionResultInt } from "../../../../types/data-types";
import VpVerifyResultSummary from "./VpVerifyResultSummary";
import DisplayVcCardView from "./DisplayVcCardView";
import { Button } from "../commons/Button";
import { t } from "i18next";
import DisplayUnVerifiedVc from "./DisplayUnVerifiedVc";

const VpSubmissionResult = (
  verifiedVcs: VpSubmissionResultInt[],
  unverifiedClaims: claims[],
  txnId: string,
  requestCred: () => void,
  isSingleVc: boolean
) => {
  const { vcStatus } = verifiedVcs[0];
  const renderRequestCredentialsButton = (propClasses = "") => (
    <Button
      id="request-credentials-button"
      title={t("Verify:rqstButton")}
      className={`w-[300px] mt-4 mb-[100px] lg:ml-[76px] ${propClasses}`}
      fill
      onClick={requestCred}
      disabled={txnId !== ""}
    />
  );

  const isLargeScreen = window.innerWidth >= 1024;

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
            unverifiedClaims.map((vc) => (
              <DisplayUnVerifiedVc vc={vc} />
            ))}
        </div>
      </div>
      {!isLargeScreen && (
        <div className="flex justify-center">
          {renderRequestCredentialsButton()}
        </div>
      )}
    </div>
  );
};

export default VpSubmissionResult;
