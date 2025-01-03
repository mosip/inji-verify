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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vc: any;
  status: string;
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

  if (!isOpen) return null;

  const desiredOrder = [
    "fullName",
    "gender",
    "dob",
    "benefits",
    "policyName",
    "policyNumber",
    "policyIssuedOn",
    "policyExpiresOn",
    "mobile",
    "email",
  ];
  type Detail = {
    key: string;
    value: string;
  };

  const orderedDetails: Detail[] = desiredOrder.map((value) => {
    const key = Object.keys(vc.credentialSubject).find((key) => key === value);
    if (key) {
      return { key, value: vc.credentialSubject[key] };
    }
    return { key: value, value: "N/A" };
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
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
              <span className="font-medium text-sm">Status: {status}</span>
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
          <div className="grid grid-cols-2 gap-4">
            {orderedDetails.map((label) => (
              <div key={label.key}>
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
            ))}
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
