import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  AppError,
  OpenID4VPVerificationProps,
  QrData,
  SessionState,
  VerificationResults,
  VerificationStatus,
} from "./OpenID4VPVerification.types";
import { vpRequest, vpRequestStatus, vpResult } from "../../utils/api";
import "./OpenID4VPVerification.css";
import { isSdJwt } from "../../utils/utils";

const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent;
  const isMobile = MOBILE_DEVICE_REGEX.test(userAgent);

  if (!isMobile && userAgent.includes("Mac") && "ontouchend" in document) {
    return true;
  }

  return isMobile;
};

const OpenID4VPVerification: React.FC<OpenID4VPVerificationProps> = ({
  triggerElement,
  verifyServiceUrl,
  protocol,
  presentationDefinitionId,
  presentationDefinition,
  transactionId,
  onVPReceived,
  onVPProcessed,
  qrCodeStyles,
  onQrCodeExpired,
  onError,
  clientId,
  isSameDeviceFlowEnabled = true,
}) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const hasInitializedRef = useRef(false);
  const isActiveRef = useRef(true);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionStateRef = useRef<SessionState | null>(null);
  const isPollingRef = useRef(false);

  const shouldShowQRCode = !loading && qrCodeData;

  const DEFAULT_PROTOCOL = "openid4vp://";

  const VPFormat = useMemo(
    () => ({
      ldp_vp: {
        proof_type: [
          "Ed25519Signature2018",
          "Ed25519Signature2020",
          "RsaSignature2018",
        ],
      },
      "vc+sd-jwt": {
        "sd-jwt_alg_values": ["RS256", "ES256", "ES256K", "EdDSA"],
        "kb-jwt_alg_values": ["RS256", "ES256", "ES256K", "EdDSA"],
      },
    }),
    []
  );

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    isPollingRef.current = false;
  }, []);

  const clearSessionData = useCallback(() => {
    sessionStateRef.current = null;
  }, []);

  const resetState = useCallback(() => {
    stopPolling();
    setQrCodeData(null);
    setLoading(false);
    hasInitializedRef.current = false;
    isActiveRef.current = false;
    sessionStateRef.current = null;
  }, [stopPolling]);

  const getPresentationDefinitionParams = useCallback(
    (data: QrData) => {
      const params = new URLSearchParams();
      params.set("client_id", clientId);
      if (data.requestUri) {
        params.set("request_uri", verifyServiceUrl + data.requestUri);
      } else if (data.authorizationDetails) {
        params.set("state", data.requestId);
        params.set("response_mode", data.authorizationDetails.responseMode);
        params.set("response_type", data.authorizationDetails.responseType);
        params.set("nonce", data.authorizationDetails.nonce);
        params.set("response_uri", data.authorizationDetails.responseUri);
        if (data.authorizationDetails.presentationDefinitionUri) {
          params.set(
            "presentation_definition_uri",
            verifyServiceUrl + data.authorizationDetails.presentationDefinitionUri
          );
        } else {
          params.set(
            "presentation_definition",
            JSON.stringify(data.authorizationDetails.presentationDefinition)
          );
        }
        params.set(
          "client_metadata",
          JSON.stringify({
            client_name: clientId,
            vp_formats: VPFormat,
          })
        );
      }
      return params.toString();
    },
    [verifyServiceUrl, clientId, VPFormat]
  );

  const fetchVPResult = useCallback(
    async (txnId: string) => {
      if (!isActiveRef.current) return;
      setLoading(true);
      try {
        if (onVPProcessed && txnId) {
          const vcResults = await vpResult(verifyServiceUrl, txnId);
          if (!isActiveRef.current) return;

          if (vcResults && vcResults.length > 0) {
            const VPResult: VerificationResults = vcResults.map(
              (vcResult: { vc: any; verificationStatus: VerificationStatus }) => ({
                vc: isSdJwt(vcResult.vc) ? vcResult.vc : JSON.parse(vcResult.vc),
                vcStatus: vcResult.verificationStatus,
              })
            );
            onVPProcessed(VPResult);
            resetState();
            return;
          }
        }

        if (onVPReceived && txnId && isActiveRef.current) {
          onVPReceived(txnId);
          resetState();
        }
      } catch (error) {
        if (isActiveRef.current) {
          onError(error as AppError);
          resetState();
        }
      }
    },
    [verifyServiceUrl, onVPProcessed, onVPReceived, onError, resetState]
  );

  const fetchVPStatus = useCallback(
    async (reqId: string, txnId: string) => {
      if (isPollingRef.current) {
        stopPolling();
      }

      isPollingRef.current = true;

      if (!isActiveRef.current || !isPollingRef.current) return;
      
      abortControllerRef.current = new AbortController();

      try {
        const response = await vpRequestStatus(verifyServiceUrl, reqId, abortControllerRef.current.signal);
        if (!isActiveRef.current || !isPollingRef.current) return;

        if (response.status === "ACTIVE") {
          fetchVPStatus(reqId, txnId);
        } else if (response.status === "VP_SUBMITTED") {
          fetchVPResult(txnId);
        } else if (response.status === "EXPIRED") {
          resetState();
          onQrCodeExpired();
        }
      } catch (error:any) {
        if (error?.name === "AbortError") return;

        if (isActiveRef.current) {
          stopPolling();
          setLoading(false);
          resetState();
          onError(error as AppError);
        }
      }
    },
    [
      verifyServiceUrl,
      onQrCodeExpired,
      onError,
      fetchVPResult,
      resetState,
      clearSessionData,
      stopPolling,
    ]
  );

  const createVPRequest = useCallback(async () => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    setLoading(true);
    isActiveRef.current = true;
    try {
      const data = await vpRequest(
        verifyServiceUrl,
        clientId,
        transactionId ?? undefined,
        presentationDefinitionId,
        presentationDefinition
      );

      sessionStateRef.current = {
        requestId: data.requestId,
        transactionId: data.transactionId,
      };

      if (!isSameDeviceFlowEnabled) {
        fetchVPStatus(data.requestId, data.transactionId);
      }
      return getPresentationDefinitionParams(data);
    } catch (error) {
      onError(error as AppError);
      resetState();
    }
  }, [
    verifyServiceUrl,
    transactionId,
    presentationDefinitionId,
    presentationDefinition,
    getPresentationDefinitionParams,
    onError,
    clientId,
  ]);

  const handleTriggerClick = () => {
    if (isSameDeviceFlowEnabled && isMobileDevice()) {
      startVerification();
    } else {
      handleGenerateQRCode();
    }
  };

  const handleGenerateQRCode = async () => {
    const pdParams = await createVPRequest();
    if (pdParams) {
      const qrData = `${protocol || DEFAULT_PROTOCOL}authorize?${pdParams}`;
      setQrCodeData(qrData);
      setLoading(false);
    }
  };

  const startVerification = async () => {
    const pdParams = await createVPRequest();
    if (pdParams) {
      window.location.href = `${protocol || DEFAULT_PROTOCOL }authorize?${pdParams}`;
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (
          sessionStateRef.current &&
          isActiveRef.current &&
          !isPollingRef.current
        ) {
          const { requestId, transactionId } = sessionStateRef.current;
          fetchVPStatus(requestId, transactionId);
        }
      } else {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchVPStatus, stopPolling]);

  useEffect(() => {
    if (!presentationDefinitionId && !presentationDefinition) {
      throw new Error(
        "Either presentationDefinitionId or presentationDefinition must be provided, but not both"
      );
    }
    if (presentationDefinitionId && presentationDefinition) {
      throw new Error(
        "Both presentationDefinitionId and presentationDefinition cannot be provided simultaneously"
      );
    }
    if (!onVPReceived && !onVPProcessed) {
      throw new Error(
        "Either onVpReceived or onVpProcessed must be provided, but not both"
      );
    }
    if (onVPReceived && onVPProcessed) {
      throw new Error(
        "Both onVPReceived and onVPProcessed cannot be provided simultaneously"
      );
    }
    if (!onQrCodeExpired) {
      throw new Error("onQrCodeExpired callback is required");
    }
    if (!onError) {
      throw new Error("onError callback is required");
    }
  }, [
    createVPRequest,
    onError,
    onQrCodeExpired,
    onVPProcessed,
    onVPReceived,
    presentationDefinition,
    presentationDefinitionId,
    triggerElement,
  ]);

  useEffect(() => {
    if (!triggerElement) {
      if (isSameDeviceFlowEnabled && isMobileDevice()) {
        startVerification();
      } else {
        handleGenerateQRCode();
      }
    }
  }, [
    triggerElement,
    isSameDeviceFlowEnabled,
    startVerification,
    handleGenerateQRCode,
    presentationDefinition,
  ]);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      stopPolling();
      clearSessionData();
    };
  }, [stopPolling, clearSessionData]);

  return (
    <div className={"ovp-root-div-container"}>
      {loading && <div id="ovp-loader" className={"ovp-loader"} />}

      {!loading && triggerElement && !qrCodeData && (
        <div onClick={handleTriggerClick} style={{ cursor: "pointer" }}>
          {triggerElement}
        </div>
      )}

      {shouldShowQRCode && (
        <QRCodeSVG
          value={qrCodeData}
          size={qrCodeStyles?.size || 200}
          level={qrCodeStyles?.level || "L"}
          bgColor={qrCodeStyles?.bgColor || "#ffffff"}
          fgColor={qrCodeStyles?.fgColor || "#000000"}
          marginSize={qrCodeStyles?.margin || 10}
          style={{ borderRadius: qrCodeStyles?.borderRadius || 10 }}
        />
      )}
    </div>
  );
};

export default OpenID4VPVerification;
