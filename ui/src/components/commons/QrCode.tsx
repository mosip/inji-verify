import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCodeProps } from "../../types/data-types";
import { QrCodeOutLine } from "../../utils/theme-utils";
import ResultSummary from "../Home/VerificationSection/Result/ResultSummary";

export const QrCode = (props: QrCodeProps) => {
  return (
    <div className={`flex flex-col text-center content-center justify-center ${props.status !== "EXPIRED" && "mt-10 lg:mt-0 pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px]"}`}>
      <div className="xs:col-end-13">
        {props.status === "EXPIRED" ? (
          <div className={`text-whiteText w-full`}>
            <ResultSummary status={"TIMEOUT"} />
          </div>
        ) : (
          <h1 className="mb-5">{props.title}</h1>
        )}
        <div
          className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto bg-cover ${
            props.status === "EXPIRED" &&
            "top-[-50px] bg-white rounded-lg my-0 drop-shadow-md"
          }`}
          style={{ backgroundImage: `url(${ props.status !== "EXPIRED" && QrCodeOutLine})` }}
        >
          <QRCodeSVG
            value={props.data}
            size={props.size}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
          />
        </div>
        <p
          className={`text-lg text-qrCodeTimer text-center ${
            props.status === "EXPIRED" && "mt-[-20px] mb-5"
          }`}
        >
          {props.footer}
        </p>
      </div>
    </div>
  );
};
