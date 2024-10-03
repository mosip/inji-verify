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
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Slider } from "@mui/material";

let timer: NodeJS.Timeout;

function QrScanner() {
  const dispatch = useAppDispatch();
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const zxingRef = useRef<any>(null);
  const [resolution, setResolution] = useState("720p");
  const [zoomLevel, setZoomLevel] = useState(0);
  const scannerRef = useRef<HTMLDivElement>(null);

  const readBarcodeFromCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      let imageData;
      if (!canvas.width && !canvas.height) return;
      else if (canvas && zxingRef.current) {
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
    const zoom = 1 + zoomLevel / 10;

    if (canvas && video) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;
      ctx?.save();
      ctx?.translate(canvasCenterX, canvasCenterY);
      ctx?.scale(zoom, zoom);
      ctx?.translate(-canvasCenterX, -canvasCenterY);
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      readBarcodeFromCanvas(canvas);
    }
    requestAnimationFrame(processFrame);
  }, [readBarcodeFromCanvas, zoomLevel]);

  const startVideoStream = useCallback(() => {
    const constraints: MediaStreamConstraints = {
      video: {
        frameRate: { ideal: 30 },
      },
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
          : [0, 0];
      constraints.video = {
        width: { ideal: width },
        height: { ideal: height },
        facingMode: "environment",
      };
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
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
  }, [processFrame, resolution]);

  const stopVideoStream = () => {
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
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

  const handleSliderChange = (value: number) => {
    if (value >= 0 && value <= 10) {
      setZoomLevel(value);

      switch (value) {
        case 0 || 2:
          setResolution("720p");
          break;
        case 4:
          setResolution("1080p");
          break;
        case 6:
          setResolution("1440p");
          break;
        case 8:
          setResolution("2160p");
          break;
        default:
          break;
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
    // Disable inbuilt border around the video
    if (scannerRef?.current) {
      let svgElements = scannerRef?.current?.getElementsByTagName("svg");
      if (svgElements.length === 1) {
        svgElements[0].style.display = "none";
      }
    }
  }, [scannerRef]);

  const marks = [
    { value: 0, label: "0" },
    { value: 1, label: "|" },
    { value: 2, label: "2" },
    { value: 3, label: "|" },
    { value: 4, label: "4" },
    { value: 5, label: "|" },
    { value: 6, label: "6" },
    { value: 7, label: "|" },
    { value: 8, label: "8" },
    { value: 9, label: "|" },
    { value: 10, label: "10" },
  ];

  function valuetext(value: number) {
    return `${value}%`;
  }

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
          <div className="absolute bottom-16 w-4/5 flex items-center justify-center">
            {/* Decrease Button */}
            <MinusOutlined
              onClick={() => handleSliderChange(zoomLevel - 2)}
              className="bg-white text-orange-600 border border-orange-600 p-2 rounded-full mr-3"
            />

            {/* Slider */}
            <div className="lg:hidden flex flex-col items-center space-y-2 w-60">
              <Slider
                aria-label="Always visible"
                defaultValue={0}
                min={0}
                max={10}
                getAriaValueText={valuetext}
                value={zoomLevel}
                step={10}
                marks={marks}
                valueLabelDisplay="on"
                sx={{
                  color: "#FF7F00",
                  ".MuiSlider-markLabel": {
                    color: "gray",
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
