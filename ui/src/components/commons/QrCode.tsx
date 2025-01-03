import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCodeProps } from "../../types/data-types";
import {
  QrCodeOutLine,
  ReGenerateIcon,
  WhiteReGenerateIcon,
} from "../../utils/theme-utils";
import { Button } from "../Home/VerificationSection/commons/Button";
import {
  resetVpRequest,
  setSelectCredential,
} from "../../redux/features/verify/vpVerificationState";
import { useAppDispatch } from "../../redux/hooks";
import ResultSummary from "../Home/VerificationSection/Result/ResultSummary";

export const QrCode = (props: QrCodeProps) => {
  const dispatch = useAppDispatch();
  const [isHover, setHover] = useState(false);
  const Regenerate = isHover ? WhiteReGenerateIcon : ReGenerateIcon;
  const ReGenerateQrCode = () => {
    dispatch(resetVpRequest());
    dispatch(setSelectCredential());
  };

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
            // opacity={props.status === "EXPIRED" ? 0.4 : 1}
          />
          {/* {props.status === "EXPIRED" && (
            <Button
              title={"Generate New QR Code"}
              className="absolute lg:bottom-[70px] lg:left-[30px] w-[300px]"
              onClick={ReGenerateQrCode}
              icon={<Regenerate />}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            />
          )} */}
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
