import React from "react";
import scanQr from "../../../assets/qr-border.svg";
import qrIcon from "../../../assets/qr_code.svg";
import { ReactComponent as TabScanFillIcon } from "../../../assets/tab-scan-fill.svg";
import StyledButton from "./commons/StyledButton";
import { UploadQrCode } from "./UploadQrCode";
import { useAppDispatch } from "../../../redux/hooks";
import { qrReadInit } from "../../../redux/features/verification/verification.slice";
import { useVerificationFlowSelector } from "../../../redux/features/verification/verification.selector";
import { checkInternetStatus } from "../../../utils/misc";
import { updateInternetConnectionStatus } from "../../../redux/features/application-state/application-state.slice";

const Scan = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <StyledButton
        id="scan-button"
        icon={<TabScanFillIcon className="fill-inherit" />}
        className="mx-0 my-1.5 py-3 text-center inline-flex absolute top-[160px] left-[33px] w-[205px] lg:w-[223px] lg:left-[63px] lg:top-[231px] fill-[#7F56D9] hover:fill-white !text-[#7F56D9] hover:!text-white !border-[#7F56D9] hover:!bg-[#7F56D9] !rounded-xl"
        fill={false}
        onClick={async (event) => {
          dispatch(
            updateInternetConnectionStatus({
              internetConnectionStatus: "LOADING",
            })
          );
          let isOnline = await checkInternetStatus();
          dispatch(
            updateInternetConnectionStatus({
              internetConnectionStatus: isOnline ? "ONLINE" : "OFFLINE",
            })
          );
          if (isOnline) {
            document.getElementById("trigger-scan")?.click();
          }
        }}
      >
        Scan
      </StyledButton>
      <button
        id="trigger-scan"
        className="hidden"
        onClick={() => {
          dispatch(qrReadInit({ method: "SCAN" }));
        }}
      />
    </>
  );
};

const Upload = () => (
  <>
    <UploadQrCode
      className="absolute top-[160px] left-[33px] w-[205px] lg:w-[223px] lg:left-[63px] lg:top-[231px]"
      displayMessage="Upload"
    />
  </>
);

const ScanQrCode = () => {
  const method = useVerificationFlowSelector((state) => state.method);
  return (
    <div className="flex flex-col pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
      <div className="xs:col-end-13">
        <div
          className={`relative grid content-center justify-center w-[275px] lg:w-[350px] aspect-square my-1.5 mx-auto bg-cover`}
          style={{ backgroundImage: `url(${scanQr})` }}
        >
          <div className="grid bg-[#F9F5FF] rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center"></div>
          <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
            <img src={qrIcon} className="w-[78px] lg:w-[100px]" alt="qr-icon" />
          </div>
          {method === "SCAN" ? <Scan /> : <Upload />}
        </div>
      </div>
    </div>
  );
};

export default ScanQrCode;
