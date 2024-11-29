import React, { useCallback, useEffect, useRef, useState } from "react";
import CameraAccessDenied from "./CameraAccessDenied";
import {
  CONSTRAINTS_IDEAL_FRAME_RATE,
  CONSTRAINTS_IDEAL_HEIGHT,
  CONSTRAINTS_IDEAL_WIDTH,
  FRAME_PROCESS_INTERVAL_MS,
  INITIAL_ZOOM_LEVEL,
  ZOOM_STEP,
  ScanSessionExpiryTime,
  THROTTLE_FRAMES_PER_SEC,
  AlertMessages,
} from "../../../utils/config";
import { useAppDispatch } from "../../../redux/hooks";
import {
  goToHomeScreen,
  verificationInit,
} from "../../../redux/features/verification/verification.slice";
import { raiseAlert } from "../../../redux/features/alerts/alerts.slice";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Slider } from "@mui/material";
import Loader from "../../commons/Loader";

let timer: NodeJS.Timeout;

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const zxingRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const readBarcodeFromCanvas = useRef((canvas: HTMLCanvasElement) => {
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
  });

  const processFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = canvas.width * (video.videoHeight / video.videoWidth);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      readBarcodeFromCanvas.current(canvas);
    }
    setTimeout(() => {
      requestAnimationFrame(processFrame);
    }, THROTTLE_FRAMES_PER_SEC);
  }, []);

  const startVideoStream = useCallback(() => {
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: CONSTRAINTS_IDEAL_WIDTH },
        height: { ideal: CONSTRAINTS_IDEAL_HEIGHT },
        frameRate: { ideal: CONSTRAINTS_IDEAL_FRAME_RATE },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        videoRef.current!.disablePictureInPicture = true;
        videoRef.current!.playsInline = true;
        videoRef.current!.controls = false;
        videoRef
          .current!.play()
          .then(() => {
            setIsLoading(false);
            setTimeout(processFrame, FRAME_PROCESS_INTERVAL_MS);
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
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

  const handleZoomChange = (value: number) => {
    if (value >= 0 && value <= 10 && videoRef.current) {
      setZoomLevel(value);
    }
  };

  const handleSliderChange = (_: any, value: number | Number[]) => {
    if (typeof value === "number") {
      if (value >= 0 && value <= 10 && videoRef.current) {
        setZoomLevel(value);
      }
    }
  };

  useEffect(() => {
    timer = setTimeout(() => {
      dispatch(goToHomeScreen({}));
      dispatch(
        raiseAlert({ ...AlertMessages().scanSessionExpired, open: true })
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

  return (
    <div
      ref={scannerRef}
      className="fixed inset-0 lg:inset-auto flex items-center justify-center h-full lg:w-[21rem] lg:h-auto lg:aspect-square lg:relative lg:overflow-visible z-[100000]"
    >
      {isLoading && (
        <div className="absolute flex items-center justify-center bg-white inset-0 lg:inset-auto">
          <Loader innerBg="bg-white"/>
        </div>
      )}

      {!isCameraBlocked && (
        <div
          id="scanning-line"
          className={`hidden lg:${
            isLoading ? "hidden" : "block"
          } scanning-line absolute flex items-center justify-center`}
        />
      )}

      <div
        className={`relative h-screen w-screen lg:h-full lg:w-full bg-black lg:rounded-lg overflow-hidden flex items-center justify-center ${
          isLoading ? "hidden" : "block"
        }`}
      >
        <button
          onClick={() => {
            stopVideoStream();
            dispatch(goToHomeScreen({}));
          }}
          className="absolute top-7 right-4 lg:hidden bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-[60]"
          aria-label="Close Scanner"
        >
          ✕
        </button>

        <div className="h-screen lg:h-auto flex items-center justify-center">
          <div className="overflow-hidden">
            <video
              ref={videoRef}
              className="object-cover rounded-lg lg:aspect-square"
              style={{
                transform: `scale(${1 + zoomLevel / ZOOM_STEP}) translateZ(0)`,
                willChange: "transform",
                WebkitTransform: `scale(${
                  1 + zoomLevel / ZOOM_STEP
                }) translateZ(0)`,
              }}
            />
          </div>

          <div className="lg:hidden absolute bottom-20 w-4/5 flex items-center justify-center">
            <MinusOutlined
              onClick={() => handleZoomChange(zoomLevel - 1)}
              className="bg-gradient text-white border border-primary p-2 rounded-full mr-3"
            />

            <div className="w-60">
              <Slider
                key={`${zoomLevel}`}
                aria-label="Zoom Level"
                min={0}
                max={10}
                step={1}
                value={zoomLevel}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChange}
                marks
                valueLabelDisplay="on"
                sx={{
                  color: "var(--iv-primary-color)",
                  ".MuiSlider-valueLabel": {
                    backgroundColor: "var(--iv-primary-color)",
                    color: "white",
                  },
                  '& .MuiSlider-track': {
                    background: "linear-gradient(90deg, #FF5300 0%, #FB5103 16%, #F04C0F 31%, #DE4322 46%, #C5363C 61%, #A4265F 75%, #7C1389 90%, #5B03AD 100%)", // Gradient color for the track
                  },
                  '.MuiSlider-rail': {
                    background: "linear-gradient(90deg, #FF5300 0%, #FB5103 16%, #F04C0F 31%, #DE4322 46%, #C5363C 61%, #A4265F 75%, #7C1389 90%, #5B03AD 100%)", // Gradient color for the track
                  },
                }}
              />
            </div>

            <PlusOutlined
              className="bg-gradient text-white p-2 border border-primary rounded-full ml-3"
              onClick={() => handleZoomChange(zoomLevel + 1)}
            />
          </div>
        </div>
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
