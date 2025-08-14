import React from "react";
import { convertToId, convertToTitleCase, getDisplayValue } from "../../../../utils/misc";

interface VcDetailsGridProps {
  orderedDetails: { key: string; value: any }[];
}

const VcDetailsGrid: React.FC<VcDetailsGridProps> = ({ orderedDetails }) => {
  return (
    <div className="grid relative">
      {orderedDetails.map((label: { key: string; value: any }, index: number) => {
        const faceIndex = orderedDetails.findIndex(
          (item: { key: string; value: any }) => item.key === "face"
        );
        const isEven = (index - (faceIndex !== -1 ? 1 : 0)) % 2 === 0;
        return label.key === "face" ? (
          <React.Fragment key={label.key}>
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
          </React.Fragment>
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
  );
};

export default VcDetailsGrid;