import { QrIcon } from "../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import Loader from "../../commons/Loader";
import { useTranslation } from "react-i18next";
import VpSubmissionResult from "./Result/VpSubmissionResult";
import { useAppDispatch } from "../../../redux/hooks";
import {
  getVpRequest,
  resetVpRequest,
  setSelectedClaims,
  setSharingType,
  verificationSubmissionComplete,
} from "../../../redux/features/verify/vpVerificationState";
import { VCShareType, VpSubmissionResultInt } from "../../../types/data-types";
import { Button } from "./commons/Button";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import { AlertMessages, insuranceCredentialPresentationDefinition } from "../../../utils/config";
import OpenID4VPVerification from "../../openid4vp-verification/OpenID4VPVerification";

const DisplayActiveStep = () => {
  const { t } = useTranslation("Verify");
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const txnId = useVerifyFlowSelector((state) => state.txnId);
  const unverifiedClaims = useVerifyFlowSelector(
    (state) => state.unVerifiedClaims
  );
  const sharingType =
  insuranceCredentialPresentationDefinition.input_descriptors.length > 1
      ? VCShareType.MULTIPLE
      : VCShareType.SINGLE;
  const verifiedVcs: VpSubmissionResultInt[] = useVerifyFlowSelector(
    (state) => state.verificationSubmissionResult
  );
  const qrSize = window.innerWidth <= 1024 ? 240 : 320;
  const isSingleVc = sharingType === VCShareType.SINGLE;

  const dispatch = useAppDispatch();

  if (isSingleVc) {
    dispatch(setSharingType({ sharingType: VCShareType.SINGLE }));
  } else {
    dispatch(setSharingType({ sharingType: VCShareType.MULTIPLE }));
  }

  const handleRequestCredentials = () => {
    dispatch(resetVpRequest());
  };

  const handleRegenerateQr = () => {
    dispatch(setSelectedClaims({ selectedClaims: unverifiedClaims }));
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

  const handleOnError = () => {
    dispatch(raiseAlert({ ...AlertMessages().unexpectedError, open: true }));
    dispatch(resetVpRequest());
  };

  const selectedClaims = insuranceCredentialPresentationDefinition.input_descriptors.flatMap((input) =>
    input.constraints.fields.map((field) => field.filter.pattern)
  );

  const handleSelectedClaims = () => {
    dispatch(setSelectedClaims({selectedClaims}));
  };

  const renderRequestCredentialsButton = () => (
      <Button
        id="request-credentials-button"
        title={t("rqstButton")}
        className={`w-[300px] mx-auto lg:ml-[76px] mt-10 hidden lg:block`}
        fill
        onClick={handleRequestCredentials}
        disabled={txnId !== ""}
      />
    );

  if (isLoading) {
    return <Loader className={`absolute lg:top-[200px] right-[100px]`} />;
  } else if (
    selectedClaims.length === 1 &&
    unverifiedClaims.length === 1 &&
    isSingleVc
  ) {
    dispatch(
      raiseAlert({ ...AlertMessages().incorrectCredential, open: true })
    );
    dispatch(resetVpRequest());
  } else if (verifiedVcs.length > 0) {
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
        { renderRequestCredentialsButton() }
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
                  triggerElement={ <QrIcon className="w-[78px] lg:w-[100px]" onClick={handleSelectedClaims} /> }
                  verifyServiceUrl={window._env_.VERIFY_SERVICE_API_URL}
                  presentationDefinition={insuranceCredentialPresentationDefinition}
                  onVpProcessed={handleOnVpProcessed}
                  onQrCodeExpired={handleOnQrExpired}
                  onError={handleOnError}
                  qrCodeStyles={{ size: qrSize }}
                />
              </div>
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
