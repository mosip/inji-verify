import React, { useEffect, useRef, useState } from "react";
import CameraAccessDenied from "./CameraAccessDenied";
import { ScanSessionExpiryTime } from "../../../utils/config";
import { useAppDispatch } from "../../../redux/hooks";
import {
  goHomeScreen,
  verificationInit,
} from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import "./ScanningLine.css";
import { initiateQrScanning, terminateScanning } from "../../../utils/qr-utils";

let timer: NodeJS.Timeout;

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);

  const scannerRef = useRef<HTMLDivElement>(null);

  const onSuccess = (decodedText: any) => {
    dispatch(
      verificationInit({
        qrReadResult: { qrData: decodedText, status: "SUCCESS" },
        flow: "SCAN",
      })
    );
    clearTimeout(timer);
  };

  useEffect(() => {
    timer = setTimeout(() => {
      dispatch(goHomeScreen({}));
      dispatch(
        raiseAlert({
          open: true,
          message:
            "The scan session has expired due to inactivity. Please initiate a new scan.",
          severity: "error",
        })
      );
      terminateScanning();
    }, ScanSessionExpiryTime);
    initiateQrScanning(timer, onSuccess);
    return () => {
      console.log("Clearing timeout");
      clearTimeout(timer);
    };
  }, [dispatch]);

  useEffect(() => {
    // Disable inbuilt border around the video
    if (scannerRef?.current) {
      let svgElements = scannerRef?.current?.getElementsByTagName("svg");
      if (svgElements.length === 1) {
        svgElements[0].style.display = "none";
      }
    }
  }, [scannerRef]);

  return (
    <div ref={scannerRef} className="relative">
      {!isCameraBlocked && (
        <div className="absolute top-[-15px] left-[-15px] h-[280px] w-[280px] lg:top-[-12px] lg:left-[-12px] lg:h-[340px] lg:w-[340px] flex items-center justify-center">
          <div id="scanning-line" className="scanning-line"></div>
        </div>
      )}

      <div
        className="none absolute h-[250px] w-[250px] lg:h-[316px] lg:w-[316px] rounded-lg overflow-hidden flex items-center justify-center"
        id="reader"
      />

      <CameraAccessDenied
        open={isCameraBlocked}
        handleClose={() => {
          console.log("closing camera");
          dispatch(goHomeScreen({}));
          setIsCameraBlocked(false);
        }}
      />
    </div>
  );
}

export default QrScanner;
