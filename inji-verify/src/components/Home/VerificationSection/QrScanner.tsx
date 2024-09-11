import React, { useCallback, useEffect, useRef, useState } from "react";
import CameraAccessDenied from "./CameraAccessDenied";
import { ScanSessionExpiryTime } from "../../../utils/config";
import { useAppDispatch } from "../../../redux/hooks";
import {
  goHomeScreen,
  verificationInit,
} from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import "./ScanningLine.css";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

let timer: NodeJS.Timeout;

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  // Start the scanner
  const startScanner = async () => {
    if (!codeReader.current || isScanning) return;
    setIsScanning(true);

    try {
      const devices = await codeReader.current.getVideoInputDevices();
      if (devices.length === 0) {
        console.error("No camera devices found.");
        setIsScanning(false);
        return;
      }

      // Select the first camera device
      const firstDeviceId = devices[0].deviceId;

      await codeReader.current.decodeFromVideoDevice(
        firstDeviceId,
        videoRef.current!,
        (result, err) => {
          if (result) {
            dispatch(
              verificationInit({
                qrReadResult: { qrData: result.getText(), status: "SUCCESS" },
                flow: "SCAN",
              })
            );
            clearTimeout(timer);
            stopScanner();
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error("Error occurred:", err);
            setIsCameraBlocked(true);
            clearTimeout(timer);
          }
        }
      );
    } catch (e) {
      console.error("Failed to start the scanner: " + e);
      setIsScanning(false);
    }
  };

  // Stop the scanner
  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    // Initialize the code reader when the component mounts
    codeReader.current = new BrowserMultiFormatReader();
    startScanner();
    return () => {
      // Cleanup: stop the scanner when the component unmounts
      stopScanner();
    };
  }, []);

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
      stopScanner();
    }, ScanSessionExpiryTime);
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

  window.onpopstate = () => console.log("browser back===>>");

  return (
    <div ref={scannerRef} className="relative">
      {!isCameraBlocked && (
        <div className="absolute top-[-15px] left-[-15px] h-[280px] w-[280px] lg:top-[-12px] lg:left-[-12px] lg:h-[340px] lg:w-[340px] flex items-center justify-center">
          <div id="scanning-line" className="scanning-line"></div>
        </div>
      )}

      <div className="relative h-[250px] w-[250px] lg:h-[316px] lg:w-[316px] rounded-lg overflow-hidden flex items-center justify-center">
        <video ref={videoRef} className="qr-scanner-video" />
      </div>

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
