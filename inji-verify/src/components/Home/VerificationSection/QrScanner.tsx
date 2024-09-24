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

let timer: NodeJS.Timeout;

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const cameraMode = "environment";
  const [resolution, setResolution] = useState("1080p");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const zxingRef = useRef<any>(null);

  const scannerRef = useRef<HTMLDivElement>(null);

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
    }, ScanSessionExpiryTime);

    // Dynamically load ZXing from window object
    const loadZxing = async () => {
      try {
        const zxing = await window.ZXing();
        zxingRef.current = zxing;
        startVideoStream(cameraMode, resolution);
      } catch (error) {
        console.error("Error loading ZXing:", error);
      }
    };

    loadZxing();

    return () => {
      clearTimeout(timer);
      stopVideoStream();
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

  const startVideoStream = (camera: string, resolution: string) => {
    const constraints: MediaStreamConstraints = {
      video: { facingMode: camera },
    };

    // Add constraints for specific resolution
    if (resolution) {
      const [width, height] =
        resolution === "2160p"
          ? [3840, 2160]
          : resolution === "1440p"
          ? [2560, 1440]
          : resolution === "1080p"
          ? [1920, 1080]
          : resolution === "720p"
          ? [1280, 720]
          : resolution === "480p"
          ? [640, 480]
          : resolution === "360p"
          ? [480, 360]
          : [0, 0];
      constraints.video = {
        width: { ideal: width },
        height: { ideal: height },
        facingMode: camera,
      };
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.load();
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
        processFrame();
      })
      .catch((error) => {
        setIsCameraBlocked(true);
        console.error("Error accessing camera:", error);
      });
  };

  const stopVideoStream = () => {
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const readBarcodeFromCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas && zxingRef.current) {
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const imageData = ctx?.getImageData(0, 0, imgWidth, imgHeight);
      const sourceBuffer = imageData?.data;

      if (sourceBuffer) {
        const buffer = zxingRef.current._malloc(sourceBuffer.byteLength);
        zxingRef.current.HEAPU8.set(sourceBuffer, buffer);
        const result = zxingRef.current.readBarcodeFromPixmap(
          buffer,
          imgWidth,
          imgHeight,
          true,
          ""
        );
        zxingRef.current._free(buffer);

        if (result.format) {
          clearTimeout(timer);
          stopVideoStream();
          dispatch(
            verificationInit({
              qrReadResult: { qrData: result.text, status: "SUCCESS" },
              flow: "SCAN",
            })
          );
        }
      }
    }
  };

  const processFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      readBarcodeFromCanvas(canvas);
    }
    requestAnimationFrame(processFrame);
  };

  const requestFullscreen = (element: HTMLDivElement | null) => {
    if (!document.fullscreenEnabled) {
      console.error("Fullscreen API is not supported or not enabled.");
    }

    if (element) {
      // Check if element is focusable
      if (!element.tabIndex) {
        element.tabIndex = 0;
      }

      // Check if fullscreen already active
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      // Request fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        // Firefox
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        // IE/Edge
        (element as any).msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      // Check if the device is mobile
      const element = scannerRef.current;
      requestFullscreen(element);
    }
  }, []);

  return (
    <div
      ref={scannerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden lg:relative lg:overflow-visible"
    >
      {!isCameraBlocked && (
        <div className="absolute top-[-15px] left-[-15px] h-[280px] w-[280px] lg:top-[-12px] lg:left-[-12px] lg:h-[340px] lg:w-[340px] flex items-center justify-center">
          <div
            id="scanning-line"
            className="hidden lg:block scanning-line"
          ></div>
        </div>
      )}

      <div className="relative h-screen w-screen lg:h-[316px] lg:w-[316px] rounded-lg overflow-hidden flex items-center justify-center z-0">
        <button
          onClick={() => {
            stopVideoStream();
            dispatch(goHomeScreen({}));
          }}
          className="absolute top-4 right-4 lg:hidden bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-20"
          aria-label="Close Scanner"
        >
          ✕
        </button>

        <div className="relative h-screen w-screen rounded-lg overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="h-full w-full lg:h-60 object-cover rounded-lg"
          />
        </div>
      </div>

      <CameraAccessDenied
        open={isCameraBlocked}
        handleClose={() => {
          dispatch(goHomeScreen({}));
          setIsCameraBlocked(false);
        }}
      />
    </div>
  );
}

export default QrScanner;
