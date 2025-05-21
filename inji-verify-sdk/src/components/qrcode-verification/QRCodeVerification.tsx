import { useCallback, useEffect, useRef, useState } from "react";
import {
  QRCodeVerificationProps,
  scanResult,
} from "../../components/qrcode-verification/QRCodeVerification.types";
import { scanFilesForQr, doFileChecks } from "../../utils/uploadQRCodeUtils";
import {
  acceptedFileTypes,
  BASE64_PADDING,
  CONSTRAINTS_IDEAL_FRAME_RATE,
  CONSTRAINTS_IDEAL_HEIGHT,
  CONSTRAINTS_IDEAL_WIDTH,
  FRAME_PROCESS_INTERVAL_MS,
  INITIAL_ZOOM_LEVEL,
  OvpQrHeader,
  ScanSessionExpiryTime,
  THROTTLE_FRAMES_PER_SEC,
  ZOOM_STEP,
} from "../../utils/constants";
import { vcSubmission, vcVerification } from "../../utils/api";
import { decodeQrData, handleOvpFlow } from "../../utils/dataProcessor";
import { readBarcodes } from "zxing-wasm/full";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Slider } from "@mui/material";
import "./QRCodeVerification.css";

const QRCodeVerification: React.FC<QRCodeVerificationProps> = ({
  triggerElement,
  verifyServiceUrl,
  onVCReceived,
  onVCProcessed,
  onError,
  isEnableUpload,
  isEnableScan,
  uploadButtonId,
  uploadButtonStyle,
  enableZoom,
}) => {
  isEnableUpload = isEnableUpload ?? true;
  isEnableScan = isEnableScan ?? true;
  enableZoom = enableZoom ?? true;
  const [isScanning, setScanning] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamingRef = useRef(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const shouldEnableZoom = enableZoom && isMobile;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!verifyServiceUrl) {
    throw new Error("verifyServiceUrl is required.");
  }
  if (!isEnableUpload && !isEnableScan) {
    throw new Error("Either scan or upload must be enabled.");
  }
  if (!onVCReceived && !onVCProcessed) {
    throw new Error(
      "Either onVcReceived or onVcProcessed must be provided, but not both."
    );
  }
  if (onVCReceived && onVCProcessed) {
    throw new Error(
      "Both onVcReceived and onVcProcessed cannot be provided simultaneously."
    );
  }
  if (!onError) {
    throw new Error("onError callback is required.");
  }

  const readBarcodeFromCanvas = useRef(async (canvas: HTMLCanvasElement) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    try {
      if (!imageData) return;
      const results = await readBarcodes(imageData);
      if (results.length > 0 && results[0].text) {
        clearTimer();
        stopVideoStream();
        setScanning(true);
        const decodedText = await decodeQrData(
          new TextEncoder().encode(results[0].text)
        );
        const vc = JSON.parse(decodedText);
        triggerCallbacks(vc);
      }
    } catch (error) {
      handleError(error);
    }
  });

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;

    // Match canvas size exactly with video frame size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    readBarcodeFromCanvas.current(canvas);

    setTimeout(
      () => requestAnimationFrame(processFrame),
      THROTTLE_FRAMES_PER_SEC
    );
  }, []);

  const startVideoStream = useCallback(() => {
    if (!isEnableScan || isCameraActive || streamingRef.current) return;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: CONSTRAINTS_IDEAL_WIDTH },
          height: { ideal: CONSTRAINTS_IDEAL_HEIGHT },
          frameRate: { ideal: CONSTRAINTS_IDEAL_FRAME_RATE },
          facingMode: "environment",
        },
      })
      .then((stream) => {
        streamingRef.current = true;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.disablePictureInPicture = true;
        video.playsInline = true;
        video.controls = false;

        const playVideo = () => {
          video
            .play()
            .then(() => {
              setTimeout(processFrame, FRAME_PROCESS_INTERVAL_MS);
            })
            .catch((error) => {
              onError(error);
            });
        };
        video.onloadedmetadata = () => {
          playVideo();
        };
      })
      .catch(onError);
  }, [isEnableScan, isCameraActive, onError, processFrame]);

  const stopVideoStream = () => {
    streamingRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    const stream = video.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.onloadedmetadata = null;
      video.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      clearTimer();
      stopVideoStream();
      const file = e.target?.files?.[0];
      if (!file || !doFileChecks(file)) return (e.target.value = "");
      setUploading(true);
      const result: scanResult = await scanFilesForQr(file);
      if (result.error) throw result.error;
      await processScanResult(result.data);
      e.target.value = "";
    } catch (error) {
      e.target.value = "";
      setUploading(false);
      handleError(error);
    }
  };

  const processScanResult = async (data: any) => {
    try {
      const vc = await extractVerifiableCredential(data);
      if (vc instanceof Error) throw new Error("Invalid QR code data.");
      if (
        (typeof vc === "string" ? vc : JSON.stringify(vc)).endsWith(
          BASE64_PADDING
        )
      )
        throw new Error("VC Type Not Supported");
      await triggerCallbacks(vc);
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const extractVerifiableCredential = async (data: any) => {
    try {
      if (data?.vpToken) return data.vpToken.verifiableCredential[0];
      if (data.startsWith(OvpQrHeader)) return await handleOvpFlow(data);
      const decoded = await decodeQrData(new TextEncoder().encode(data));
      return JSON.parse(decoded);
    } catch (error) {
      return error;
    }
  };

  const triggerCallbacks = async (vc: any) => {
    try {
      if (onVCReceived) {
        const id = await vcSubmission(vc, verifyServiceUrl);
        onVCReceived(id);
      } else if (onVCProcessed) {
        const status = await vcVerification(vc, verifyServiceUrl);
        onVCProcessed([{ vc, vcStatus: status }]);
      }
      setScanning(false);
      setUploading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setScanning(false);
      setUploading(false);
      setIsCameraActive(true);
      startVideoStream();
    }
  };

  const handleError = (error: unknown) => {
    const err =
      error instanceof Error ? error : new Error("Unknown error occurred");
    onError(err);
  };

  const handleZoomChange = (value: number) => {
    if (value >= 0 && value <= 10) setZoomLevel(value);
  };

  const handleSliderChange = (_: any, value: number | number[]) => {
    if (typeof value === "number") handleZoomChange(value);
  };

  useEffect(() => {
    if (!isEnableScan) return;
    startVideoStream();
    setIsCameraActive(true);
    timerRef.current = setTimeout(() => {
      stopVideoStream();
      onError(new Error("scanSessionExpired"));
    }, ScanSessionExpiryTime);
    startVideoStream();
    return () => {
      clearTimer();
      stopVideoStream();
    };
  }, [isEnableScan, onError, startVideoStream, isUploading]);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  const startScanning =
    isCameraActive && isEnableScan && !isUploading && !isScanning;
  console.log(shouldEnableZoom);

  return (
    <div className="qrcode-container">
      {triggerElement && !isUploading && !isScanning && (
        <div className="cursor-pointer">{triggerElement}</div>
      )}
      {(isUploading || isScanning) && <div className="loader"></div>}

      <div className={`qr-wrapper ${!shouldEnableZoom ? "no-zoom" : ""}`}>
        {startScanning && (
          <div
            className={`qr-preview ${
              shouldEnableZoom ? "zoom-enabled" : "no-zoom"
            }`}
          >
            {shouldEnableZoom && (
              <button
                onClick={() => {
                  stopVideoStream();
                }}
                className="qr-close-button"
                aria-label="Close Scanner"
              >
                ✕
              </button>
            )}
            <video
              ref={videoRef}
              className="qr-video"
              style={{
                transform: shouldEnableZoom
                  ? `scale(${1 + zoomLevel / ZOOM_STEP})`
                  : undefined,
              }}
              playsInline
              autoPlay
              muted
            />
            {shouldEnableZoom && (
              <div className="qr-overlay">
                <div className="centered-row">
                  <MinusOutlined
                    onClick={() => handleZoomChange(zoomLevel - 1)}
                    className={`zoom-button-decrease${
                      zoomLevel === 0 ? " disabled" : ""
                    }`}
                  />
                  <div className="slider-container">
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
                        color: "#fff",
                        ".MuiSlider-valueLabel": {
                          backgroundColor:
                            "linear-gradient(90deg, #FF5300 0%, #FB5103 16%, #F04C0F 31%, #DE4322 46%, #C5363C 61%, #A4265F 75%, #7C1389 90%, #5B03AD 100%)",
                          color: "white",
                        },
                        "& .MuiSlider-track": {
                          background:
                            "linear-gradient(90deg, #FF5300 0%, #FB5103 16%, #F04C0F 31%, #DE4322 46%, #C5363C 61%, #A4265F 75%, #7C1389 90%, #5B03AD 100%)", // Gradient color for the track
                        },
                        ".MuiSlider-rail": {
                          background:
                            "linear-gradient(90deg, #FF5300 0%, #FB5103 16%, #F04C0F 31%, #DE4322 46%, #C5363C 61%, #A4265F 75%, #7C1389 90%, #5B03AD 100%)", // Gradient color for the track
                        },
                      }}
                    />
                  </div>
                  <PlusOutlined
                    className={`zoom-button-increase${
                      zoomLevel === 10 ? " disabled" : ""
                    }`}
                    onClick={() => handleZoomChange(zoomLevel + 1)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {isEnableUpload && (
          <div
            className={`upload-container ${
              shouldEnableZoom ? "fixed-enabled" : "default"
            }`}
          >
            <input
              type="file"
              id={uploadButtonId || "upload-qr"}
              name={uploadButtonId || "upload-qr"}
              accept={acceptedFileTypes}
              className={`upload-button ${
                uploadButtonStyle ? uploadButtonStyle : "upload-button-default"
              }`}
              onChange={handleUpload}
              disabled={isUploading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeVerification;
