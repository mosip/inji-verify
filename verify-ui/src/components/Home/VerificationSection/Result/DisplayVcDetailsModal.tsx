import React from "react";
import { VectorCollapse, VectorDownload } from "../../../../utils/theme-utils";
import {
  convertToId,
  convertToTitleCase,
  getDisplayValue,
  saveData,
} from "../../../../utils/misc";
import ActionButton from "../commons/ActionButton";
import { useTranslation } from "react-i18next";
import { getDetailsOrder } from "../../../../utils/commonUtils";
import { VC, VcStatus } from "../../../../types/data-types";
import {
  backgroundColorMapping,
  borderColorMapping,
  textColorMapping,
} from "../../../../utils/config";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vc: VC;
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
  const orderedDetails = getDetailsOrder(vc);

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
          <div className="grid relative">
            {orderedDetails.map((label, index) => {
              const faceIndex = orderedDetails.findIndex( (item) => item.key === "face" );
              const isEven = (index - (faceIndex !== -1 ? 1 : 0)) % 2 === 0;
              return label.key === "face" ? (
                <>
                  <img
                    src={label.value}
                    alt="face"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  />
                </>
              ) : (
                <div
                  className={`py-2.5 px-1 xs:col-end-13 ${
                    isEven
                      ? "lg:col-start-1 lg:col-end-6"
                      : "lg:col-start-8 lg:col-end-13"
                  }`}
                  key={label.key}
                >
                  <p
                    id={convertToId(label.key)}
                    className="font-normal text-verySmallTextSize break-all text-[#666666]"
                  >
                    {convertToTitleCase(label.key)}
                  </p>
                  <p
                    id={`${convertToId(label.key)}-value`}
                    className="font-bold text-smallTextSize break-all"
                  >
                    {getDisplayValue(label.value)}
                  </p>
                </div>
              );
            })}
          </div>
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
