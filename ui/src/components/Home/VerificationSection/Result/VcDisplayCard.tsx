import React, { useState } from "react";
import {
  convertToId,
  convertToTitleCase,
  getDisplayValue,
} from "../../../../utils/misc";
import { Button } from "../commons/Button";
import {
  DocumentIcon,
  DownloadIcon,
  WhiteDownloadIcon,
} from "../../../../utils/theme-utils";
import { useAppDispatch } from "../../../../redux/hooks";
import { goToHomeScreen } from "../../../../redux/features/verification/verification.slice";
import { useTranslation } from "react-i18next";
import { resetVpRequest } from "../../../../redux/features/verify/verifyState";

function VcDisplayCard(props: displayProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isHover, setHover] = useState(false);
  const Download = isHover ? WhiteDownloadIcon : DownloadIcon;

  const saveData = async () => {
    const myData = props.vc;
    const fileName = `${props.vc.credentialSubject.fullName}`;
    const json = JSON.stringify(myData);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div>
      <div
        className={`grid w-[340px] m-auto bg-white rounded-[12px] py-[5px] px-[15px] shadow-lg`}
      >
        {props.vc ? (
          Object.keys(props.vc.credentialSubject)
            .filter(
              (key) =>
                key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type" && key?.toLowerCase() != "face"
            )
            .map((key, index) => (
              <div
                className={`py-2.5 px-1 xs:col-end-13 ${
                  index % 2 === 0
                    ? "lg:col-start-1 lg:col-end-6"
                    : "lg:col-start-8 lg:col-end-13"
                }`}
                key={key}
              >
                <p
                  id={convertToId(key)}
                  className="font-normal text-verySmallTextSize break-all"
                >
                  {convertToTitleCase(key)}
                </p>
                <p
                  id={`${convertToId(key)}-value`}
                  className="font-bold text-smallTextSize break-all"
                >
                  {getDisplayValue(props.vc.credentialSubject[key])}
                </p>
              </div>
            ))
        ) : (
          <div className="grid content-center justify-center w-[100%] h-[320px] text-documentIcon">
            <DocumentIcon />
          </div>
        )}
      </div>
      <div>
        <Button
          title={"Download"}
          icon={<Download />}
          className="w-[125px] mt-2"
          onClick={saveData}
          disabled={!props.vc}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </div>
      <div className="grid">
          <Button
              id="verify-another-qr-code-button"
              title="Proceed"
              className="w-[200px] lg:w-[350px] mb-20 lg:mb-6 text-lgNormalTextSize inline-flex"
              onClick={() => {
                  console.log(props.loc);
                  window.location.href = (decodeURIComponent(`${props.loc.split("?")[1].split('=')[1]}`));
              }}
          />
      </div>
    </div>
  );
}

export type displayProps = {
    vc: any;
    loc: string;
};

export default VcDisplayCard;
