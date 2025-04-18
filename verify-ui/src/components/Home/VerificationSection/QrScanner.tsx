import { useEffect, useState } from "react";
import CameraAccessDenied from "./CameraAccessDenied";
import { useAppDispatch } from "../../../redux/hooks";
import { goToHomeScreen, verificationComplete } from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import QRCodeVerification from "../../qrcode-verification/QRCodeVerification";

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setIsScanning(true);
  }, []);

  return (
    <div className="fixed inset-0 lg:inset-auto flex items-center justify-center h-full lg:w-[21rem] lg:h-auto lg:aspect-square lg:relative lg:overflow-visible z-[100000]">
      {!isCameraBlocked && (
        <div
          id="scanning-line"
          className={`hidden lg:${
            isScanning ? "block" : "hidden"
          } scanning-line absolute flex items-center justify-center`}
        />
      )}

      <div className="h-screen lg:h-full w-full flex items-center justify-center">
        <QRCodeVerification
          verifyServiceUrl={window._env_.VERIFY_SERVICE_API_URL}
          disableUpload
          enableZoom
          onVCProcessed={(data: { vc: unknown; vcStatus: string }[]) =>
            dispatch(verificationComplete({ verificationResult: data[0] }))
          }
          onError={(error) =>
            raiseAlert({ message: error.message, severity: "error" })
          }
        />
      </div>

      {isCameraBlocked && (
        <CameraAccessDenied
          open={isCameraBlocked}
          handleClose={() => {
            dispatch(goToHomeScreen({}));
            setIsCameraBlocked(false);
          }}
        />
      )}
    </div>
  );
}

export default QrScanner;
