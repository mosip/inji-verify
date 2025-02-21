import React from "react";
import {
  convertToId,
  convertToTitleCase,
  getDisplayValue,
} from "../../../../utils/misc";
import StyledButton from "../commons/StyledButton";
import { ReactComponent as DocumentIcon } from "../../../../assets/document.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function VcDisplayCard({ vc }: { vc: any }) {
  const navigate = useNavigate();
  const { t } = useTranslation("vc_card");

  const orderedKeys: (keyof typeof vc.credentialSubject)[] = [
    "fullName",
    "dateOfBirth",
    "gender",
    "email",
    "mobile",
    "id",
    "policyIssuedOn",
    "policyExpiresOn",
  ];

  const orderedObject = Object.fromEntries(
    orderedKeys
      .map((key) =>
        key === "dateOfBirth"
          ? ["dateOfBirth", vc.credentialSubject["dob"]]
          : [key, vc.credentialSubject[key]]
      )
      .filter(([key, value]) => value !== undefined) // Ensure valid values
  );

  return (
    <div>
      <div
        className={`grid w-[340px] m-auto bg-white rounded-[12px] py-[5px] px-[15px] shadow-lg`}
      >
        {vc ? (
          Object.keys(orderedObject)
            .filter(
              (key) =>
                key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type"
            )
            .map((key, index) => (
              <div
                className={`py-2.5 px-1 xs:col-end-13 ${
                  index === 0
                    ? "lg:col-start-1 lg:col-end-13"
                    : index % 2 !== 0
                    ? "lg:col-start-1 lg:col-end-6"
                    : "lg:col-start-8 lg:col-end-13"
                }`}
                key={key}
              >
                <p
                  id={convertToId(key)}
                  className="font-normal text-[11px] break-all"
                >
                  {convertToTitleCase(key)}
                </p>
                <p
                  id={`${convertToId(key)}-value`}
                  className="font-bold text-[12px] break-all"
                >
                  {getDisplayValue(orderedObject[key])}
                </p>
              </div>
            ))
        ) : (
          <div className="grid content-center justify-center w-[100%] h-[320px] text-[#000000] opacity-10">
            <DocumentIcon />
          </div>
        )}
      </div>
      <div className="grid content-center justify-center">
        <StyledButton
          id="verify-another-qr-code-button"
          className="mx-auto mt-6 mb-20 lg:mb-6 !rounded-xl !px-[8rem]"
          onClick={() => {
            navigate("/application");
          }}
        >
          {t("proceed")}
        </StyledButton>
      </div>
    </div>
  );
}

export default VcDisplayCard;
