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
import {
  decodeQrData,
  extractRedirectUrlFromQrData,
} from "../../utils/dataProcessor";
import { readBarcodes } from "zxing-wasm/full";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Slider } from "@mui/material";
import "./QRCodeVerification.css";

const QRCodeVerification: React.FC<QRCodeVerificationProps> = ({
  triggerElement,
  verifyServiceUrl,
  transactionId,
  onVCReceived,
  onVCProcessed,
  onError,
  isEnableUpload = true,
  isEnableScan = true,
  uploadButtonId,
  uploadButtonStyle,
  isEnableZoom = true,
}) => {
  const [isScanning, setScanning] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL);
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scanSessionCompletedRef = useRef(false);

  const shouldEnableZoom = isEnableZoom && isMobile;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!verifyServiceUrl) throw new Error("verifyServiceUrl is required.");
  if (!isEnableUpload && !isEnableScan)
    throw new Error("Either scan or upload must be enabled.");
  if (!onVCReceived && !onVCProcessed)
    throw new Error("One of onVCReceived or onVCProcessed is required.");
  if (onVCReceived && onVCProcessed)
    throw new Error(
      "Only one of onVCReceived or onVCProcessed can be provided."
    );
  if (!onError) throw new Error("onError callback is required.");

  const readQrCodeFromCanvas = useRef(async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    try {
      const results = await readBarcodes(imageData);
      if (results[0]?.text) {
        clearTimer();
        stopVideoStream();
        setScanning(true);
        const text = results[0].text;
        processScanResult(text);
      }
    } catch (error) {
      handleError(error);
    }
  });

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    readQrCodeFromCanvas.current(canvas);
    setTimeout(
      () => requestAnimationFrame(processFrame),
      THROTTLE_FRAMES_PER_SEC
    );
  }, []);

  const startVideoStream = useCallback(() => {
    if (
      !isEnableScan ||
      isCameraActive ||
      streamingRef.current ||
      scanSessionCompletedRef.current
    ) {
      console.log("startVideoStream aborted");
      return;
    }
    console.log("startVideoStream");
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
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.disablePictureInPicture = true;
        video.playsInline = true;
        video.controls = false;
        video.onloadedmetadata = () => {
          console.log("video loaded metadata", video.videoWidth, video.videoHeight);
          video
            .play()
            .then(() => {
              console.log("video started playing");
              streamingRef.current = true;
              setTimeout(processFrame, FRAME_PROCESS_INTERVAL_MS);
            })
            .catch(onError);
        };
        stream?.getVideoTracks().forEach((track) => {
          console.log(`Starting ${track.kind} track with id ${track.id}`);
        });
      })
      .catch(onError);
  }, [isEnableScan, isCameraActive, onError, processFrame]);

  const stopVideoStream = () => {
    const video = videoRef.current;
    console.log("video Reference in stopVideoStram", video)
    if (!video) {
      console.warn("stopVideoStream: videoRef is null");
      return;
    }
    const stream = video.srcObject as MediaStream | null;
    console.log("stopVideoStream: stream", stream);
    stream?.getVideoTracks().forEach((track) => {
      console.log(`Stopping ${track.kind} track with id ${track.id}`);
      track.stop();
    });
    video.onloadedmetadata = null;
    video.srcObject = null;
    video.removeAttribute("srcObject")
    video.removeAttribute("src");
    video.load();

    streamingRef.current = false;
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
    setLoading(true);
    try {
      const vc = await extractVerifiableCredential(data);
      if (vc instanceof Error) throw vc;
      if (vc && vc.toString().endsWith(BASE64_PADDING)) {
        throw Error("Vc Type Not Supported");
      }
      if (vc) {
        await triggerCallbacks(vc);
      }
    } catch (error) {
      throw error;
    }
  };

  const extractVerifiableCredential = async (data: any) => {
    try {
      if (data?.vpToken) return data.vpToken.verifiableCredential[0];
      if (data.startsWith(OvpQrHeader)) {
        const redirectUrl = extractRedirectUrlFromQrData(data);
        if (!redirectUrl)
          throw new Error("Failed to extract redirect URL from QR data");

        const encodedOrigin = encodeURIComponent(window.location.origin);
        const url = `${redirectUrl}&client_id=${encodedOrigin}&redirect_uri=${encodedOrigin}%2F#`;
        window.location.href = url;
      } else {
        const decoded = await decodeQrData(new TextEncoder().encode(data));
        return JSON.parse(decoded);
      }
    } catch (error) {
      return error;
    }
  };

  const triggerCallbacks = async (vc: any) => {
    try {
      if (onVCReceived) {
        const txnId = await vcSubmission(vc, verifyServiceUrl, transactionId);
        onVCReceived(txnId);
      } else if (onVCProcessed) {
        const status = await vcVerification(vc, verifyServiceUrl);
        onVCProcessed([{ vc, vcStatus: status }]);
      }
    } catch (error) {
      handleError(error);
    } finally {
      scanSessionCompletedRef.current = true;
      clearTimer();
      stopVideoStream();
      setScanning(false);
      setUploading(false);
      setLoading(false);
      setIsCameraActive(false);
    }
  };

  const handleError = (error: unknown) => {
    onError(
      error instanceof Error ? error : new Error("Unknown error occurred")
    );
  };

  const handleZoomChange = (value: number) => {
    if (value >= 0 && value <= 10) setZoomLevel(value);
  };

  const handleSliderChange = (_: any, value: number | number[]) => {
    if (typeof value === "number") handleZoomChange(value);
  };

  function base64UrlDecode(base64url: string): string {
    // Convert base64url to base64
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    return atob(base64);
  }

  useEffect(() => {
    if (!isEnableScan || scanSessionCompletedRef.current) return;
    startVideoStream();
    setIsCameraActive(true);
    timerRef.current = setTimeout(() => {
      stopVideoStream();
      onError(new Error("scanSessionExpired"));
    }, ScanSessionExpiryTime);
    return () => {
      clearTimer();
      if (videoRef.current) stopVideoStream();
    };
  }, [isEnableScan, onError, startVideoStream]);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    let vpToken, presentationSubmission, error;
    try {
      const hash = window.location.hash; // "#vp_token=abc123&state=xyz"
      const params = new URLSearchParams(hash.substring(1));
      const vpTokenParam = params.get("vp_token");
      const decoded = vpTokenParam && base64UrlDecode(vpTokenParam);
      const parseVpToken = decoded && JSON.parse(decoded);
      vpToken = vpTokenParam ? parseVpToken : null;
      presentationSubmission = params.get("presentation_submission")
        ? decodeURIComponent(params.get("presentation_submission") as string)
        : undefined;
      error = params.get("error");
      if (vpToken && presentationSubmission) {
        processScanResult({ vpToken, presentationSubmission });
        window.history.replaceState(null, "", window.location.pathname);
      } else if (!!error) {
        onError(new Error(error));
      }
    } catch (error) {
      console.error(
        "Error occurred while reading params in redirect url, Error: ",
        error
      );
      onError(error instanceof Error ? error : new Error("Unknown error"));
    }
  }, [onError, processScanResult]);

  useEffect(() => {
    return () => {
      scanSessionCompletedRef.current = false;
    };
  }, []);

  const startScanning =
    isCameraActive && isEnableScan && !isUploading && !isScanning;

  return (
    <div className="qrcode-container">
      {triggerElement && !isUploading && !isScanning && !isLoading && (
        <div className="cursor-pointer">{triggerElement}</div>
      )}
      {(isUploading || isScanning || isLoading) && (
        <div className="loader"></div>
      )}
      <div className={`qr-wrapper ${!shouldEnableZoom ? "no-zoom" : ""}`}>
        {startScanning && (
          <div
            className={`scan-container ${
              shouldEnableZoom ? "zoom-enabled" : "no-zoom"
            }`}
          >
            {shouldEnableZoom && (
              <button
                onClick={stopVideoStream}
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
                    />
                  </div>
                  <PlusOutlined
                    onClick={() => handleZoomChange(zoomLevel + 1)}
                    className={`zoom-button-increase${
                      zoomLevel === 10 ? " disabled" : ""
                    }`}
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
                uploadButtonStyle || "upload-button-default"
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
