import React from "react";
import {
  VerificationSuccessIcon,
  VerificationFailedIcon,
} from "../../../../utils/theme-utils";
import { useTranslation } from "react-i18next";
import {
  backgroundColorMapping,
  borderColorMapping,
  textColorMapping,
} from "../../../../utils/config";

const ResultSummary = ({
  status,
}: {
  status: "SUCCESS" | "EXPIRED" | "INVALID" | "TIMEOUT";
}) => {
  const bgColor = backgroundColorMapping[status];
  const textColor = textColorMapping[status];
  const borderColor = borderColorMapping[status];
  const { t } = useTranslation("ResultSummary");
  return (
    <div
      className={`flex flex-col items-center justify-center h-[170px] lg:h-[186px] ${bgColor}`}
    >
      <div className={`block mb-2.5 ${textColor}`}>
        {status === "SUCCESS" ? (
          <VerificationSuccessIcon />
        ) : (
          <VerificationFailedIcon />
        )}
      </div>
      <div className={`rounded-xl p-1 ${bgColor} border ${borderColor}`}>
        <p
          id="vc-result-display-message"
          className={`font-normal text-normalTextSize lg:text-lgNormalTextSize text-center ${textColor}`}
        >
          {t(`${status}`)}
        </p>
      </div>
    </div>
  );
};

export default ResultSummary;
