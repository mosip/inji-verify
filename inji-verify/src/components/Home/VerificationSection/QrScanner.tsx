import React, { useCallback, useEffect, useRef, useState } from "react";
import CameraAccessDenied from "./CameraAccessDenied";
import { MARKS_COUNT, ScanSessionExpiryTime } from "../../../utils/config";
import { useAppDispatch } from "../../../redux/hooks";
import {
  goHomeScreen,
  verificationInit,
} from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import "./ScanningLine.css";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Slider, CircularProgress } from "@mui/material";

let timer: NodeJS.Timeout;

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const zxingRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const readBarcodeFromCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      let imageData;
      if (canvas && zxingRef.current) {
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (imgWidth > 0 && imgHeight > 0) {
          imageData = ctx?.getImageData(0, 0, imgWidth, imgHeight);
        }
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
                qrReadResult: { qrData: result.bytes, status: "SUCCESS" },
                flow: "SCAN",
              })
            );
          }
        }
      }
    },
    [dispatch]
  );

  const processFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = canvas.width * (video.videoHeight / video.videoWidth);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      readBarcodeFromCanvas(canvas);
    }
    requestAnimationFrame(processFrame);
  }, [readBarcodeFromCanvas]);

  const startVideoStream = useCallback(() => {
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 5000 },
        height: { ideal: 5000 },
        frameRate: { ideal: 30 },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current!!.srcObject = stream;
        videoRef.current!!.disablePictureInPicture = true;
        videoRef.current!!.playsInline = true;
        videoRef.current!!.controls = false;

        videoRef.current!!.onloadeddata = () => {
          setIsLoading(false);
        };
        videoRef.current!!.play().catch((error) => {
          console.error("Error playing video:", error);
        });
        setTimeout(processFrame, 30);
      })
      .catch((error) => {
        setIsCameraBlocked(true);
        console.error("Error accessing camera:", error);
      });
  }, [processFrame]);

  const stopVideoStream = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSliderChange = (value: number) => {
    if (value >= 0 && value <= 10 && videoRef.current) {
      setZoomLevel(value);
    }
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
    }, ScanSessionExpiryTime);

    const loadZxing = async () => {
      try {
        const zxing = await window.ZXing();
        zxingRef.current = zxing;
        startVideoStream();
      } catch (error) {
        console.error("Error loading ZXing:", error);
      }
    };

    loadZxing();

    return () => {
      clearTimeout(timer);
      stopVideoStream();
    };
  }, [dispatch, startVideoStream]);

  useEffect(() => {
    if (scannerRef.current) {
      let svgElements = scannerRef.current.getElementsByTagName("svg");
      if (svgElements.length === 1) {
        svgElements[0].style.display = "none";
      }
    }
  }, [scannerRef]);

  const sliderMarks = Array.from({ length: MARKS_COUNT }, (_, i) => ({
    key: `mark-${i}`,
    value: i,
    label: i % 2 === 0 ? `${i}` : "|",
  }));

  return (
    <div
      ref={scannerRef}
      className="fixed inset-0 lg:inset-auto flex items-center justify-center overflow-hidden lg:relative lg:overflow-visible"
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute flex items-center justify-center bg-white z-10 inset-0 lg:inset-auto">
          <CircularProgress color="warning" />
        </div>
      )}

      {!isCameraBlocked && (
        <div className="absolute top-[-15px] left-[-15px] h-[280px] w-[280px] lg:top-[-12px] lg:left-[-12px] lg:h-[340px] lg:w-[340px] flex items-center justify-center">
          <div
            id="scanning-line"
            className={`hidden lg:${
              isLoading ? "hidden" : "block"
            } scanning-line`}
          ></div>
        </div>
      )}

      <div
        className={`relative h-screen w-screen lg:h-full lg:w-full bg-black rounded-lg overflow-hidden flex items-center justify-center z-0 ${
          isLoading ? "hidden" : "block"
        }`}
      >
        <button
          onClick={() => {
            stopVideoStream();
            dispatch(goHomeScreen({}));
          }}
          className="absolute top-10 right-4 lg:hidden bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-20"
          aria-label="Close Scanner"
        >
          ✕
        </button>

        <div className="h-screen lg:h-auto relative rounded-lg overflow-hidden flex items-center justify-center">
          <div className="lg:h-auto overflow-hidden">
            <video
              ref={videoRef}
              className="object-cover rounded-lg"
              style={{
                transform: `scale(${1 + zoomLevel / 10}) translateZ(0)`,
                willChange: "transform",
                WebkitTransform: `scale(${1 + zoomLevel / 10}) translateZ(0)`,
              }}
            />
          </div>

          <div className="lg:hidden absolute bottom-20 w-4/5 flex items-center justify-center">
            {/* Decrease Button */}
            <MinusOutlined
              onClick={() => handleSliderChange(zoomLevel - 2)}
              className="bg-white text-orange-600 border border-orange-600 p-2 rounded-full mr-3"
            />

            {/* Slider */}
            <div className="flex flex-col items-center space-y-2 w-60">
              <Slider
                key={`${zoomLevel}`}
                aria-label="Zoom Level"
                min={0}
                max={10}
                step={1}
                value={zoomLevel}
                marks={sliderMarks}
                valueLabelDisplay="on"
                sx={{
                  color: "#FF7F00",
                  ".MuiSlider-markLabel": {
                    color: "gray",
                    transition: "none",
                  },
                  ".MuiSlider-valueLabel": {
                    backgroundColor: "#FF7F00",
                    color: "white",
                  },
                }}
              />
            </div>

            {/* Increase Button */}
            <PlusOutlined
              className="bg-white text-orange-600 p-2 border border-orange-600 rounded-full ml-3"
              onClick={() => handleSliderChange(zoomLevel + 2)}
            />
          </div>
        </div>
      </div>

      {isCameraBlocked && (
        <CameraAccessDenied
          open={isCameraBlocked}
          handleClose={() => {
            dispatch(goHomeScreen({}));
            setIsCameraBlocked(false);
          }}
        />
      )}
    </div>
  );
}

export default QrScanner;
