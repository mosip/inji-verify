import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  OpenID4VPVerificationProps,
  QrData,
  VerificationResults,
  VerificationStatus,
} from "./OpenID4VPVerification.types";
import { vpRequest, vpRequestStatus, vpResult } from "../../utils/api";

const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
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
  isEnableSameDeviceFlow = true,
  clientId,
}) => {
  const [txnId, setTxnId] = useState<string | null>(transactionId || null);
  const [reqId, setReqId] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWallets, setShowWallets] = useState<boolean>(false);
  const hasInitializedRef = useRef(false);

  const shouldShowQRCode = !loading && qrCodeData && !showWallets;

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
    }),
    []
  );

  const getPresentationDefinitionParams = useCallback(
    (data: QrData) => {
      const params = new URLSearchParams();
      params.set("client_id", clientId);
      if (data.requestUri) {
        params.set("request_uri", verifyServiceUrl + data.requestUri);
      } else if (data.authorizationDetails) {
        params.set("state", data.requestId);
        params.set("response_mode", "direct_post");
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
    [verifyServiceUrl]
  );

  const fetchVPResult = useCallback(async () => {
    setLoading(true);
    try {
      if (onVPProcessed && txnId) {
        const vcResults = await vpResult(verifyServiceUrl, txnId);
        const VPResult: VerificationResults = vcResults.map(
          (vcResult: { vc: any; verificationStatus: VerificationStatus }) => ({
            vc: JSON.parse(vcResult.vc),
            vcStatus: vcResult.verificationStatus,
          })
        );
        onVPProcessed?.(VPResult);
        resetState();
      }
      if (onVPReceived && txnId) {
        onVPReceived(txnId);
        resetState();
      }
    } catch (error) {
      onError(error as Error);
      resetState();
    }
  }, [verifyServiceUrl, txnId, onVPProcessed, onVPReceived, onError]);

  const fetchVPStatus = useCallback(async () => {
    try {
      if (reqId) {
        const response = await vpRequestStatus(verifyServiceUrl, reqId);

        if (response.status === "ACTIVE") {
          fetchVPStatus();
        }
        if (response.status === "VP_SUBMITTED") {
          fetchVPResult();
        } else if (response.status === "EXPIRED") {
          resetState();
          onQrCodeExpired();
        }
      }
    } catch (error) {
      setLoading(false);
      resetState();
      onError(error as Error);
    }
  }, [verifyServiceUrl, reqId, onQrCodeExpired, onError, fetchVPResult]);

  const createVPRequest = useCallback(async () => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    setLoading(true);
    try {
      const data = await vpRequest(
        verifyServiceUrl,
        clientId,
        txnId ?? undefined,
        presentationDefinitionId,
        presentationDefinition
      );
      setTxnId(data.transactionId);
      setReqId(data.requestId);
      const params = getPresentationDefinitionParams(data);
      return params;
    } catch (error) {
      onError(error as Error);
      resetState();
    }
  }, [
    verifyServiceUrl,
    txnId,
    presentationDefinitionId,
    presentationDefinition,
    getPresentationDefinitionParams,
    onError,
  ]);

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
    if (isEnableSameDeviceFlow && isMobileDevice()) {
      if (!triggerElement) {
        startVerification();
      }
    } else if (!triggerElement) {
      handleGenerateQRCode();
    }
  }, []);

  useEffect(() => {
    if (reqId) {
      fetchVPStatus();
    }
  }, [fetchVPStatus, reqId]);

  const resetState = () => {
    setTxnId(null);
    setReqId(null);
    setQrCodeData(null);
    setShowWallets(false);
    setLoading(false);
    hasInitializedRef.current = false;
  };

  const handleTriggerClick = () => {
    if (isEnableSameDeviceFlow && isMobileDevice()) {
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
      const openidUrl = `${protocol || DEFAULT_PROTOCOL}authorize?${pdParams}`;
      window.location.href = openidUrl;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100%",
      }}
    >
      {loading && (
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid #ccc",
            borderTop: "4px solid #333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "20px auto",
          }}
        />
      )}

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
