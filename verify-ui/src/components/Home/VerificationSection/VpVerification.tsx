import { useEffect } from "react";
import { QrIcon } from "../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import Loader from "../../commons/Loader";
import VpSubmissionResult from "./Result/VpSubmissionResult";
import { useAppDispatch } from "../../../redux/hooks";
import {
  getVpRequest,
  resetVpRequest,
  setSelectCredential,
  verificationSubmissionComplete,
} from "../../../redux/features/verify/vpVerificationState";
import { VCShareType, VpSubmissionResultInt } from "../../../types/data-types";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import { AlertMessages } from "../../../utils/config";
import { OpenID4VPVerification } from "@mosip/react-inji-verify-sdk";
import { Button } from "./commons/Button";
import { useTranslation } from "react-i18next";

const DisplayActiveStep = () => {
  const { t } = useTranslation("Verify");	
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const txnId = useVerifyFlowSelector((state) => state.txnId);
  const sharingType = useVerifyFlowSelector((state) => state.sharingType);
  const isSingleVc = sharingType === VCShareType.SINGLE;
  const selectedClaims = useVerifyFlowSelector((state) => state.selectedClaims);
  const verifiedVcs: VpSubmissionResultInt[] = useVerifyFlowSelector((state) => state.verificationSubmissionResult );
  const unverifiedClaims = useVerifyFlowSelector((state) => state.unVerifiedClaims );
  const presentationDefinition = useVerifyFlowSelector((state) => state.presentationDefinition );
  const qrSize = window.innerWidth <= 1024 ? 240 : 320;
  const activeScreen = useVerifyFlowSelector((state) => state.activeScreen );
  const showResult = useVerifyFlowSelector((state) => state.isShowResult );
  const dispatch = useAppDispatch();

  const handleRequestCredentials = () => {
      dispatch(setSelectCredential());
  };

  const handleRegenerateQr = () => {
    dispatch(getVpRequest({ selectedClaims: unverifiedClaims }));
  };

  const handleRestartProcess = () => {
    dispatch(resetVpRequest());
  };

  const handleOnVpProcessed = (vpResult: {}) => {
    dispatch(verificationSubmissionComplete({ verificationResult: vpResult }));
  };

  const handleOnQrExpired = () => {
    dispatch(raiseAlert({ ...AlertMessages().sessionExpired, open: true }));
    dispatch(resetVpRequest());
  };

  const handleOnError = (error:Error) => {
    dispatch(raiseAlert({ message:error.message, severity:"error", open:true }));
    dispatch(resetVpRequest());
  };

  useEffect(() => {
    if (selectedClaims.length > 0 && activeScreen === 3) {
      setTimeout(() => {
        const triggerElement = document.getElementById("OpenID4VPVerification_trigger");
        if (triggerElement) {
          const event = new MouseEvent("click", { bubbles: true, cancelable: true });
          triggerElement.dispatchEvent(event);
        }
      }, 100); // Delay to ensure the DOM is updated
    }
  }, [selectedClaims, activeScreen]);

  if (isLoading) {
    return <Loader className={`absolute lg:top-[200px] right-[100px]`} />;
  } else if (
    selectedClaims.length === 1 &&
    unverifiedClaims.length === 1 &&
    isSingleVc
  ) {
    dispatch(resetVpRequest());
    dispatch(
      raiseAlert({ ...AlertMessages().incorrectCredential, open: true })
    );
  } else if (showResult) {
    return (
      <div className="w-[100vw] lg:w-[50vw] display-flex flex-col items-center justify-center">
        <VpSubmissionResult
          verifiedVcs={verifiedVcs}
          unverifiedClaims={unverifiedClaims}
          txnId={txnId}
          requestCredentials={handleRequestCredentials}
          reGenerateQr={handleRegenerateQr}
          restart={handleRestartProcess}
          isSingleVc={isSingleVc}
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col mt-10 lg:mt-0 pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
        <div className="xs:col-end-13">
          <div
            className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`grid bg-${window._env_.DEFAULT_THEME}-lighter-gradient rounded-[12px] w-[300px] lg:w-[350px] aspect-square content-center justify-center`}
              >
                <OpenID4VPVerification
                  triggerElement={ <QrIcon id="OpenID4VPVerification_trigger" className="w-[78px] lg:w-[100px]" aria-disabled={presentationDefinition.input_descriptors.length === 0 } /> }
                  verifyServiceUrl={window.location.origin + window._env_.VERIFY_SERVICE_API_URL}
                  presentationDefinition={presentationDefinition}
                  onVPProcessed={handleOnVpProcessed}
                  onQrCodeExpired={handleOnQrExpired}
                  onError={handleOnError}
                  qrCodeStyles={{ size: qrSize }}
                />
              </div>
              <Button	
                id="request-credentials-button"	
                title={t("rqstButton")}	
                className={`w-[300px] mx-auto lg:ml-[76px] mt-10 lg:hidden`}	
                fill	
                onClick={handleRequestCredentials}	
                disabled={activeScreen === 3 }	
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export const VpVerification = () => {
  return <div>{DisplayActiveStep()}</div>;
};
