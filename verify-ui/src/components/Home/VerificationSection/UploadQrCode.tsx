import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { GradientUploadIcon, WhiteUploadIcon } from "../../../utils/theme-utils";
import { RootState } from "../../../redux/store";
import { isRTL } from "../../../utils/i18n";
import {QRCodeVerification} from "@mosip/react-inji-verify-sdk";
import { verificationComplete } from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";

export const UploadQrCode = ({
  displayMessage,
  className,
}: {
  displayMessage: string;
  className?: string;
}) => {
  const dispatch = useAppDispatch();

  const [isHover, setHover] = useState(false);

  const UploadButton = ({ displayMessage }: { displayMessage: string }) => {
    const UploadIcon = isHover ? WhiteUploadIcon : GradientUploadIcon;
    const language = useAppSelector(
      (state: RootState) => state.common.language
    );
    const rtl = isRTL(language);

    return (
      <div
        className={`bg-${window._env_.DEFAULT_THEME}-gradient hover:text-white p-px bg-no-repeat rounded-[5px] w-[180px] mt-10`}
      >
        <label
          htmlFor={"upload-qr"}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={() => setHover(true)}
          className={`group bg-white hover:bg-${window._env_.DEFAULT_THEME}-gradient font-bold h-[40px] rounded-[5px] flex content-center justify-center text-lgNormalTextSize pt-2 cursor-pointer`}
        >
          <span className={`${rtl ? "ml-1.5" : "mr-1.5"}`}>
            <UploadIcon />
          </span>
          <span
            id="upload-qr-code-button"
            className={`bg-${window._env_.DEFAULT_THEME}-gradient bg-clip-text text-transparent group-hover:text-white`}
          >
            {displayMessage}
          </span>
        </label>
      </div>
    );
  };

  return (
    <div
      className={`mx-auto my-1.5 flex flex-col content-center justify-center w-full ${className}`}
    >
      <QRCodeVerification
        triggerElement={<UploadButton displayMessage={displayMessage} />}
        verifyServiceUrl={window._env_.VERIFY_SERVICE_API_URL}
        disableScan
        onVCProcessed={(data: { vc: unknown; vcStatus: string }[]) =>
          dispatch(verificationComplete({ verificationResult: data[0] }))
        }
        uploadButtonId={"upload-qr"}
        uploadButtonStyle="hidden"
        onError={(error) =>
          raiseAlert({ message: error.message, severity: "error" })
        }
      />
    </div>
  );
};
