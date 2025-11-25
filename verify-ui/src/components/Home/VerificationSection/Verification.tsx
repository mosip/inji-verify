import React, { useState, useEffect } from "react";
import Loader from "../../commons/Loader";
import QrScanner from "./QrScanner";
import { Button } from "./commons/Button";
import { useAppDispatch } from "../../../redux/hooks";
import { goToHomeScreen } from "../../../redux/features/verification/verification.slice";
import {Pages, VerificationSteps} from "../../../utils/config";
import { useVerificationFlowSelector } from "../../../redux/features/verification/verification.selector";
import { ScanOutline } from "../../../utils/theme-utils";
import { useTranslation } from "react-i18next";

const Verification = () => {
  const dispatch = useAppDispatch();
  const { activeScreen, method } = useVerificationFlowSelector((state) => ({
    activeScreen: state.activeScreen,
    method: state.method,
  }));
  const {t} = useTranslation()
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    const pathName = sessionStorage.getItem("pathName");
    if (pathName?.includes(Pages.Scan)) {
      setScannerActive(false);
    }
  }, []);

  const handleBack = () => {
    setScannerActive(false);
    setTimeout(() => {
      dispatch(goToHomeScreen({}));
    }, 80);
  };

  return (
    <div className="grid grid-cols-12 mx-auto pt-1 pb-[100px] px-[16px] lg:py-[42px] lg:px-[104px] text-center content-center justify-center">
      <div
        className="col-start-1 col-end-13 grid w-[110%] h-auto lg:w-[360px] aspect-square max-w-[280px] lg:max-w-none bg-cover content-center justify-center m-auto"
        style={{
          backgroundImage: `url(${ScanOutline})`,
        }}
      >
        {method && activeScreen === VerificationSteps[method].Verifying ? (
          <Loader innerBg="bg-white"/>
        ) : (
          <QrScanner scannerActive={scannerActive} onClose={handleBack}/>
        )}
      </div>
      <div className="col-span-12">
        <Button
          id="verification-back-button"
          title={t("Common:Button.back")}
          className="w-[100px] lg:w-[350px] mt-[18px] mx-0 my-1.6 text-lgNormalTextSize inline-flex"
          onClick={handleBack}
        />
      </div>
    </div>
  );
};

export default Verification;