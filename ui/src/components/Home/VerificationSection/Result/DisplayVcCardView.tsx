import React, { useState } from "react";
import { convertToId, convertToTitleCase } from "../../../../utils/misc";
import { VectorDown, VectorUp } from "../../../../utils/theme-utils";
import { VpSubmissionResultInt } from "../../../../types/data-types";
import DisplayVcDetailsModal from "./DisplayVcDetailsModal";
import DisplayVcDetailView from "./DisplayVcDetailView";
import { useTranslation } from "react-i18next";

const backgroundColorMapping: any = {
  SUCCESS: "bg-[#ECFFF6]",
  EXPIRED: "bg-[#FFF5E3]",
  INVALID: "bg-[#FFDEDD]",
};
const textColorMapping: any = {
  SUCCESS: "text-[#1F9F60]",
  EXPIRED: "text-[#D98C00]",
  INVALID: "text-[#CB4241]",
};

const borderColorMapping: any = {
  SUCCESS: "border-[#ABEFC6]",
  EXPIRED: "border-[#E2CA9F]",
  INVALID: "border-[#D68E8D]",
};

function DisplayVcCardView(ViewVc: VpSubmissionResultInt) {
  const { vc, vcStatus, view } = ViewVc;
  const [showDetailView, setShowDetailView] = useState(view);
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("Verify");
  const imgUrl = vc.issuerLogo.url;
  const imgAlt = vc.issuerLogo.alt_text;
  const credential = vc.credential;
  const credentialType: string = vc.credentialConfigurationId;

  return (
    <div>
      <div
        className={`flex items-center justify-between bg-white w-[339px] lg:w-[410px] py-[5px] px-[15px] shadow-lg ${
          showDetailView
            ? "m-auto rounded-t-[12px] h-[82px]"
            : "rounded-[12px]"
        }`}
        onClick={view ? () => {} : () => setShowDetailView(!showDetailView)}
      >
        <div className="flex items-center">
          <img src={imgUrl} alt={imgAlt} className="w-[50px] h-[50px] mr-1" />
          <div
            className={`py-2.5 px-1 xs:col-end-13 lg:col-start-1 lg:col-end-6`}
            key={credentialType}
          >
            <p
              id={`${convertToId(credentialType)}-value`}
              className="font-bold text-largeTextSize break-all"
            >
              {convertToTitleCase(credentialType)}
            </p>
            <div
              className={`rounded-xl w-[43px] ${backgroundColorMapping[vcStatus]} border ${borderColorMapping[vcStatus]} mr-2 p-1`}
            >
              <p
                className={`font-normal text-smallTextSize text-center ${textColorMapping[vcStatus]}`}
              >
                {t(vcStatus)}
              </p>
            </div>
          </div>
        </div>
        {view === false && (showDetailView ? <VectorUp /> : <VectorDown />)}
      </div>
      {showDetailView && (
        <div>
          <div className={`h-[3px] border-b-2 border-b-transparent`} />
          <DisplayVcDetailView
            vc={credential}
            onExpand={() => setModalOpen(true)}
            className={`${
              view ? "h-auto" : "h-[257px]"
            } rounded-t-0 rounded-b-lg overflow-y-auto`}
          />
        </div>
      )}
      <DisplayVcDetailsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        vc={credential}
        status={vcStatus}
        vcType={credentialType}
        logo={{ url: imgUrl, alt: imgAlt }}
      />
    </div>
  );
}

export default DisplayVcCardView;
