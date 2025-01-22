import React from "react";
import { useTranslation } from "react-i18next";
import { claim, VpSubmissionResultInt } from "../../../../types/data-types";
import { useVerifyFlowSelector } from "../../../../redux/features/verification/verification.selector";
import {
  backgroundColorMapping,
  borderColorMapping,
  textColorMapping,
} from "../../../../utils/config";

interface VpVerifyResultSummaryProps {
  verifiedVcs: VpSubmissionResultInt[];
  unverifiedClaims: claim[];
}

const VpVerifyResultSummary: React.FC<VpVerifyResultSummaryProps> = ({
  verifiedVcs,
  unverifiedClaims,
}) => {
  const { t } = useTranslation("Verify");
  const selectedClaims = useVerifyFlowSelector((state) => state.selectedClaims);
  const NoOfValid: number = verifiedVcs.filter(
    (vc) => vc.vcStatus === "SUCCESS"
  ).length;
  const NoOfExpired: number = verifiedVcs.filter(
    (vc) => vc.vcStatus === "EXPIRED"
  ).length;
  const NoOfInvalid: number = verifiedVcs.filter(
    (vc) => vc.vcStatus === "INVALID"
  ).length;

  return (
    <div
      className={`flex flex-col items-center col-start-1 col-end-13 h-[170px] lg:h-[133px] bg-${window._env_.DEFAULT_THEME}-lighter-gradient w-full`}
    >
      <p className="font-normal text-lgNormalTextSize text-center mt-5">
        {selectedClaims.length} {t("credentialsRequested")}:
      </p>
      <div className="flex justify-center w-[392px]">
        {verifiedVcs.map((vc, index) => {
          const status = vc.vcStatus;
          const bgColor = backgroundColorMapping[status];
          const textColor = textColorMapping[status];
          const borderColor = borderColorMapping[status];
          return (
            index ===
              verifiedVcs.findIndex(
                (item) => item.vcStatus === vc.vcStatus
              ) && (
              <div
                className={`rounded-xl min-w-[80px] ${bgColor} border ${borderColor} mr-2 p-1`}
                key={index}
              >
                <p
                  className={`font-normal text-lgNormalTextSize text-center ${textColor}`}
                >
                  {t(vc.vcStatus)}{" "}
                  <span className={`rounded-full bg-${textColor}`}>
                    {vc.vcStatus === "SUCCESS" &&
                      NoOfValid + "/" + selectedClaims.length}
                    {vc.vcStatus === "EXPIRED" &&
                      NoOfExpired + "/" + selectedClaims.length}
                    {vc.vcStatus === "INVALID" &&
                      NoOfInvalid + "/" + selectedClaims.length}
                  </span>
                </p>
              </div>
            )
          );
        })}
        {unverifiedClaims.length > 0 && (
          <div
            className={`rounded-xl bg-[#EFEFEF] min-w-[80px] border border-[#C4C4C4] mr-2 p-1`}
          >
            <p
              className={`font-normal text-lgNormalTextSize text-center text-[#636363]`}
            >
              {t("notShared")}{" "}
              {unverifiedClaims.length + "/" + selectedClaims.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VpVerifyResultSummary;
