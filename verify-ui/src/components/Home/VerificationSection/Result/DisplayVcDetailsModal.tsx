import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { VectorCollapse, VectorDownload } from "../../../../utils/theme-utils";
import { convertToTitleCase, saveData } from "../../../../utils/misc";
import ActionButton from "../commons/ActionButton";
import { useTranslation } from "react-i18next";
import { getDetailsOrder } from "../../../../utils/commonUtils";
import { AnyVc, VcStatus } from "../../../../types/data-types";
import {
  backgroundColorMapping,
  borderColorMapping,
  textColorMapping,
} from "../../../../utils/config";
import VcDetailsGrid from "./VcDetailsGrid";
import i18next from "i18next";
import { VCRenderer } from "@mosip/inji-vc-renderer";
import { getTemplateUrl } from "../../../../utils/svg-template-utils";
import Loader from "../../../commons/Loader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vc: AnyVc;
  status: VcStatus;
  vcType: string;
  logo?: { url: any; alt: string };
}

const DisplayVcDetailsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  vc,
  status,
  vcType,
  logo,
}) => {
  const { t } = useTranslation("Verify");
  const currentLang = i18next.language;
  const orderedDetails = vc && getDetailsOrder(vc, currentLang);
  const templateUrl = getTemplateUrl(vc);

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

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {logo && (
              <img
                src={logo.url}
                alt={logo.alt}
                className="w-[50px] h-[50px] mr-1"
              />
            )}

            <div>
              <h2 className="text-lg font-bold">
                {convertToTitleCase(vcType)}
              </h2>
              <div
                className={`rounded-xl max-w-[120px] ${backgroundColorMapping[status]} border ${borderColorMapping[status]} p-1`}
              >
                <p
                  className={`font-normal text-smallTextSize text-center ${textColorMapping[status]}`}
                >
                  {t(status)}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
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
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <div className="relative">
            <ActionButton
              label={t("collapse")}
              onClick={onClose}
              icon={<VectorCollapse />}
              positionClasses="right-[10px] lg:right-[5px] lg:hover:right-[5px] bottom-[70px]"
            />
            <ActionButton
              label={t("download")}
              onClick={() => saveData(vc)}
              icon={<VectorDownload />}
              positionClasses="right-[10px] lg:right-[5px] lg:hover:right-[5px] bottom-[20px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayVcDetailsModal;
