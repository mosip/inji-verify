import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { saveData } from "../../../../utils/misc";
import {
  DocumentIcon,
  SharableLink,
  VectorDownload,
  VectorExpand,
} from "../../../../utils/theme-utils";
import ActionButton from "../commons/ActionButton";
import { useTranslation } from "react-i18next";
import { getDetailsOrder } from "../../../../utils/commonUtils";
import { isRTL } from "../../../../utils/i18n";
import { AnyVc } from "../../../../types/data-types";
import VcDetailsGrid from "./VcDetailsGrid";
import i18next from "i18next";
import { VCRenderer } from "@mosip/inji-vc-renderer";
import { getTemplateUrl } from "../../../../utils/svg-template-utils";
import Loader from "../../../commons/Loader";

function DisplayVcDetailView({
  vc,
  onExpand,
  className,
}: {
  vc: AnyVc;
  onExpand: any;
  className?: string;
}) {
  const { t, i18n } = useTranslation("Verify");
  const currentLang = i18next.language;
  const templateUrl = getTemplateUrl(vc);
  const orderedDetails = vc && getDetailsOrder(vc, currentLang);
  const isRtl = isRTL(i18n.language);
  const positionLeft = `left-[250px] ${templateUrl?"lg:left-[310px]":"lg:left-[328px]"} ${templateUrl?"lg:hover:left-[197px]":"lg:hover:left-[215px]"}`;
  const positionRight = `right-[250px] ${templateUrl?"lg:right-[310px]":"lg:right-[328px]"} ${templateUrl?"lg:hover:right-[197px]":"lg:hover:right-[215px]"}`;
  const buttonPosition = isRtl ? positionRight : positionLeft;

  const [svg, setSvg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [svgFailed, setSvgFailed] = useState<boolean>(false);

  const renderSvgTemplate = async () => {
    try {
      setSvgFailed(false);
      setLoading(true);
      const result = await VCRenderer.renderSVG(vc, currentLang, "en");

      if (result && result.trim().length > 0) {
        setSvg(result);
      } else {
        console.warn("SVG rendering returned empty string — falling back");
        setSvgFailed(true);
      }
    } catch (error) {
      console.error("Failed to render SVG:", error);
      setSvgFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateUrl) {
      renderSvgTemplate();
    }
  }, [currentLang, vc, templateUrl]);

  const shouldShowSvg = templateUrl && !svgFailed && svg && !loading;

  return (
    <div>
      <div
        className={`w-[339px] lg:w-[410px] m-auto rounded-lg ${
          templateUrl ? "" : "bg-white shadow-lg"
        } px-[15px] mb-4 ${className}`}
      >
        {vc ? (
          <div className="relative">
            {loading ? (
              <Loader innerBg="bg-white" className="w-5 h-5 mt-10" />
            ) : shouldShowSvg ? (
              <div
                className="w-full flex justify-center items-center"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg) }}
              />
            ) : (
              <VcDetailsGrid orderedDetails={orderedDetails} vc={vc} />
            )}

            {!loading && (
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
                  positionClasses={`bottom-[30px] ${buttonPosition} lg:bottom-[10px]`}
                />
              </div>
            )}
            {!templateUrl && (
              <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-gray-700 mb-3 w-[240px] lg:w-[320px]">
                <SharableLink />
                <span className="text-verySmallTextSize">
                  {t("IconToolTip")}
                </span>
              </div>
            )}
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
