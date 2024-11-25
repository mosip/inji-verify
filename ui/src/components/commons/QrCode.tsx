import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCodeProps } from "../../types/data-types";
import { QrCodeOutLine } from "../../utils/theme-utils";

export const QrCode = (props: QrCodeProps) => {
  return (
    <div className="flex flex-col mt-10 lg:mt-0 pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
      <div className="xs:col-end-13">
        <h1 className="mb-5">{props.title}</h1>
        <div
          className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto bg-cover`}
          style={{ backgroundImage: `url(${QrCodeOutLine})` }}
        >
          <QRCodeSVG
            value={props.data}
            size={props.size}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
          />
        </div>
        <p className="text-lg text-qrCodeTimer mt-5 text-center">
          {props.footer}
        </p>
      </div>
    </div>
  );
};
