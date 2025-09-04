import React from "react";
import { saveData } from "../../../../utils/misc";
import {
  DocumentIcon,
  VectorDownload,
  VectorExpand,
} from "../../../../utils/theme-utils";
import ActionButton from "../commons/ActionButton";
import { useTranslation } from "react-i18next";
import { getDetailsOrder } from "../../../../utils/commonUtils";
import { isRTL } from "../../../../utils/i18n";
import { VC } from "../../../../types/data-types";
import VcDetailsGrid from "./VcDetailsGrid";

function DisplayVcDetailView({
  vc,
  onExpand,
  className,
}: {
  vc: VC | Object;
  onExpand: any;
  className?: string;
}) {
  const { t, i18n } = useTranslation("Verify");
  
  const orderedDetails = vc && getDetailsOrder(vc);
  const isRtl = isRTL(i18n.language);
  const positionLeft = "left-[250px] lg:left-[328px] lg:hover:left-[215px]";
  const positionRight = "right-[250px] lg:right-[328px] lg:hover:right-[215px]";
  const buttonPosition = isRtl ? positionRight : positionLeft;

  return (
    <div>
      <div
        className={`w-[339px] lg:w-[410px] m-auto rounded-lg bg-white px-[15px] shadow-lg mb-4 ${className}`}
      >
        {vc ? (
          <div className="relative">
            <VcDetailsGrid orderedDetails={orderedDetails} />
            <div className="absolute inset-x-0 bottom-0 flex justify-end lg:justify-start px-4">
              <ActionButton
                label={t("expand")}
                onClick={onExpand}
                icon={<VectorExpand />}
                positionClasses={`hidden lg:flex ${buttonPosition} bottom-[60px]`}
              />
              <ActionButton
                label={t("download")}
                onClick={() => saveData(vc)}
                icon={<VectorDownload />}
                positionClasses={`${buttonPosition} bottom-[10px]`}
              />
            </div>
          </div>
        ) : (
          <div className="grid content-center justify-center w-[100%] h-[320px] text-documentIcon">
            <DocumentIcon />
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayVcDetailView;
