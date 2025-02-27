import React from "react";
import { ReactComponent as VerificationSuccessMobileIcon } from "../../../../assets/verification-success-icon-mobile.svg";
import { ReactComponent as VerificationFailedMobileIcon } from "../../../../assets/verification-failed-icon-mobile.svg";
import { useTranslation } from "react-i18next";

const backgroundColorMapping: any = {
  EXPIRED: "bg-[#BF7A1C]",
  INVALID: "bg-[#D73E3E]",
  SUCCESS: "bg-[#1F9F60]",
};

const ResultSummary = ({
  status,
}: {
  status: "SUCCESS" | "EXPIRED" | "INVALID";
}) => {
  const backgroundColor = backgroundColorMapping[status];
  const { t } = useTranslation("vc_result");
  return (
    <div className="grid grid-cols-12 w-full">
      <div
        className={`col-start-1 col-end-13 h-[170px] lg:h-[186px] w-full ${backgroundColor}`}
      >
        <div className="grid grid-cols-12 justify-items-center items-center justify-center content-center pt-[30px]">
          <div className="col-start-1 col-end-13 block mb-2.5">
            {status === "SUCCESS" ? (
              <VerificationSuccessMobileIcon />
            ) : (
              <VerificationFailedMobileIcon />
            )}
          </div>
          <div className="col-start-1 col-end-13">
            <p
              id="vc-result-display-message"
              className="font-normal text-[16px] text-center"
            >
              {status === "SUCCESS"
                ? t("success")
                : status === "INVALID"
                ? t("invalid")
                : t("expired")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
