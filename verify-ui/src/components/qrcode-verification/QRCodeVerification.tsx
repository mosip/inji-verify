import { useCallback, useEffect, useRef, useState } from "react";
import {
  QRCodeVerificationProps,
  scanResult,
} from "./QRCodeVerification.types";
import {
  decodeQrData,
  handleOvpFlow,
  OvpQrHeader,
  scanFilesForQr,
  doFileChecks,
  acceptedFileTypes,
  CONSTRAINTS_IDEAL_FRAME_RATE,
  FRAME_PROCESS_INTERVAL_MS,
  ScanSessionExpiryTime,
  THROTTLE_FRAMES_PER_SEC,
  ZOOM_STEP,
  INITIAL_ZOOM_LEVEL,
  CONSTRAINTS_IDEAL_WIDTH,
  CONSTRAINTS_IDEAL_HEIGHT,
  vcVerification,
  vcSubmission,
} from "../../utils/qrCodeUtils";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Slider } from "@mui/material";
import styles from "./QRCodeVerification.module.css";

let timer: NodeJS.Timeout;

const QRCodeVerification: React.FC<QRCodeVerificationProps> = ({
  triggerElement,
  verifyServiceUrl,
  onVCReceived,
  onVCProcessed,
  onError,
  disableScan,
  disableUpload,
  uploadButtonId,
  uploadButtonStyle,
  enableZoom,
}) => {
  const [isScanning, setScanning] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const zxingRef = useRef<{
    _malloc(size: number): number;
    HEAPU8: Uint8Array;
    _free(ptr: number): void;
    readBarcodeFromPixmap(
      buffer: number,
      width: number,
      height: number,
      tryHarder: boolean,
      format: string
    ): { format: string; bytes: Uint8Array };
  } | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  if (!verifyServiceUrl) {
    throw new Error("verifyServiceUrl is required.");
  }
  if (disableScan && disableUpload) {
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
    if (!canvas || !zxingRef.current) return;

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
        try {
          const vc = JSON.parse(await decodeQrData(result.bytes));
          setScanning(true);
          triggerCallbacks(vc);
        } catch (error) {
          handleError(error);
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.disablePictureInPicture = true;
          videoRef.current.playsInline = true;
          videoRef.current.controls = false;
          videoRef.current
            .play()
            .then(() => {
              setTimeout(processFrame, FRAME_PROCESS_INTERVAL_MS);
            })
            .catch((error) => {
              onError(error);
            });
        }
      })
      .catch((error) => {
        onError(error);
      });
  }, [onError, processFrame]);

  const stopVideoStream = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    timer = setTimeout(() => {
      return onError(new Error("scanSessionExpired"));
    }, ScanSessionExpiryTime);

    const loadZxing = async () => {
      try {
        const zxing = await window.ZXing();
        zxingRef.current = zxing;
        if (!disableScan) {
          startVideoStream();
        }
      } catch (error) {
        console.error("Error loading ZXing:", error);
      }
    };

    loadZxing();

    return () => {
      clearTimeout(timer);
      stopVideoStream();
    };
  }, [onError, startVideoStream, isUploading, isScanning, disableScan]);

  useEffect(() => {
    if (scannerRef.current) {
      const svgElements = scannerRef.current.getElementsByTagName("svg");
      if (svgElements.length === 1) {
        svgElements[0].style.display = "none";
      }
    }
  }, [scannerRef]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const BASE64_PADDING = "==";

  const handleScan = async () => {
    try {
      setScanning(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        onError(error);
      }
    } finally {
      setScanning(false);
    }
  };

  const handleUpload = async (e: any) => {
    try {
      clearTimeout(timer);
      stopVideoStream();
      const file = e?.target?.files?.[0];
      if (!validateFile(file)) {
        if (e?.target) e.target.value = "";
        return;
      }

      const scanResult: scanResult = await scanFilesForQr(file);
      if (scanResult.error) throw new Error(scanResult.error.message);
      if (!scanResult.data) throw new Error("No QR code detected in the file.");
      console.log("set uploading...");

      setUploading(true);
      await processScanResult(scanResult.data);
    } catch (error) {
      console.log("reset uploading...");
      setUploading(false);
      handleError(error);
    }
  };

  const validateFile = (file: File | undefined) => {
    return file && doFileChecks(file);
  };

  const processScanResult = async (data: any) => {
    try {
      const vc = await extractVerifiableCredential(data);

      if (!vc) throw new Error("Invalid QR code data.");
      if (vc.toString().endsWith(BASE64_PADDING))
        throw new Error("VC Type Not Supported");
      triggerCallbacks(vc);
    } catch (error) {
      handleError(error);
    }
  };

  const extractVerifiableCredential = async (data: any) => {
    if (data?.vpToken) {
      return data.vpToken.verifiableCredential[0];
    }

    const decodedData = new TextDecoder("utf-8").decode(data as Uint8Array);
    if (decodedData.startsWith(OvpQrHeader)) {
      await handleOvpFlow(decodedData);
      return null;
    }

    return JSON.parse(await decodeQrData(data as Uint8Array));
  };

  const triggerCallbacks = async (vc: any) => {
    try {
      if (onVCReceived) {
        const uuid = await vcSubmission(vc, verifyServiceUrl);
        onVCReceived(uuid);
        setScanning(false);
        setUploading(false);
      } else if (onVCProcessed) {
        const status = await vcVerification(vc, verifyServiceUrl);
        onVCProcessed([{ vc, vcStatus: status }]);
        setScanning(false);
        setUploading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error : new Error("An unknown error occurred.");
    onError(errorMessage);
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

  const shouldEnableZoom = enableZoom && isMobile;

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {triggerElement && !isUploading && !isScanning && (
        <div
          className="cursor-pointer"
          onClick={disableScan ? handleUpload : handleScan}
        >
          {triggerElement}
        </div>
      )}
      {(isUploading || isScanning) && <div className={styles.loader}></div>}
      <div
        className={`flex flex-col items-center gap-4 w-full ${
          shouldEnableZoom ? "" : "max-w-md mx-auto"
        }`}
      >
        {!disableScan && !isUploading && !isScanning && (
          <div
            ref={scannerRef}
            className={`relative overflow-hidden ${
              shouldEnableZoom
                ? "w-screen h-screen aspect-video"
                : "w-full aspect-square rounded-lg"
            }`}
          >
            {shouldEnableZoom && (
              <button
                onClick={() => {
                  stopVideoStream();
                  // dispatch(goToHomeScreen({})); // Assuming dispatch is available in context
                }}
                className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-10"
                aria-label="Close Scanner"
              >
                ✕
              </button>
            )}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover aspect-square"
              style={{
                transform: `scale(${
                  1 + (shouldEnableZoom ? zoomLevel : 0) / ZOOM_STEP
                }) translateZ(0)`,
                willChange: "transform",
                WebkitTransform: `scale(${
                  1 + (shouldEnableZoom ? zoomLevel : 0) / ZOOM_STEP
                }) translateZ(0)`,
              }}
            />
            {shouldEnableZoom && (
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center p-4 bg-black bg-opacity-50 z-10">
                <div className="w-4/5 flex items-center justify-center mb-2">
                  <MinusOutlined
                    onClick={() => handleZoomChange(zoomLevel - 1)}
                    className={`text-white border border-primary p-2 rounded-full mr-3 cursor-pointer ${
                      zoomLevel === 0 ? "opacity-50 cursor-default" : ""
                    }`}
                  />
                  <div className="flex-grow mx-2">
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
                    className={`text-white p-2 border border-primary rounded-full ml-3 cursor-pointer ${
                      zoomLevel === 10 ? "opacity-50 cursor-default" : ""
                    }`}
                    onClick={() => handleZoomChange(zoomLevel + 1)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!disableUpload && (
          <div
            className={`mt-4 w-full ${
              shouldEnableZoom
                ? "fixed bottom-0 left-0 right-0 bg-white p-4 z-20"
                : "max-w-sm"
            }`}
          >
            <input
              type="file"
              id={uploadButtonId || "upload-qr"}
              name={uploadButtonId || "upload-qr"}
              accept={acceptedFileTypes}
              className={`cursor-pointer block w-full px-4 py-2 rounded-md shadow-md text-center ${
                uploadButtonStyle || "bg-gray-300 text-black"
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
