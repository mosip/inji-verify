import React from "react";
import scanQr from "../../../assets/qr-border.svg";
import Loader from "../../commons/Loader";
import QrScanner from "./QrScanner";
import StyledButton from "./commons/StyledButton";
import { useAppDispatch } from "../../../redux/hooks";
import { goHomeScreen } from "../../../redux/features/verification/verification.slice";
import { VerificationSteps } from "../../../utils/config";
import { useVerificationFlowSelector } from "../../../redux/features/verification/verification.selector";
import { useTranslation } from "react-i18next";

const Verification = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("verification");
  const { activeScreen, method } = useVerificationFlowSelector((state) => ({
    activeScreen: state.activeScreen,
    method: state.method,
  }));
  return (
    <div className="grid grid-cols-12 mx-auto pt-1 pb-[100px] px-[16px] lg:py-[42px] lg:px-[104px] text-center content-center justify-center">
      <div
        className="col-start-1 col-end-13 grid w-[100%] lg:w-[350px] aspect-square max-w-[280px] lg:max-w-none bg-cover content-center justify-center m-auto"
        style={{
          backgroundImage: `url(${scanQr})`,
        }}
      >
        {activeScreen === VerificationSteps[method].Verifying ? (
          <Loader className="align-loading-center"/>
        ) : (
          <QrScanner />
        )}
      </div>
      <div className="col-span-12">
        <StyledButton
          id="verification-back-button"
          className="w-[100%] lg:w-[350px] max-w-[280px] lg:max-w-none mt-[18px] !text-[#7F56D9] hover:!text-white !border-[#7F56D9] hover:!bg-[#7F56D9] !rounded-xl"
          onClick={() => {
            dispatch(goHomeScreen({}));
          }}
        >
          {t("back")}
        </StyledButton>
      </div>
    </div>
  );
};

export default Verification;
