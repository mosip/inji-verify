import { QRCodeSVG } from "qrcode.react";
import {
  OpenID4VPVerificationProps,
  QrData,
  VerificationResult,
  VerificationResults,
  VerificationStatus,
  VPRequestBody,
} from "./OpenID4VPVerification.types";
import React, { useCallback, useEffect, useState } from "react";

const OpenID4VPVerification: React.FC<OpenID4VPVerificationProps> = ({
  triggerElement,
  verifyServiceUrl,
  protocol,
  presentationDefinitionId,
  presentationDefinition,
  onVPReceived,
  onVPProcessed,
  qrCodeStyles,
  onQrCodeExpired,
  onError,
}) => {
  const [txnId, setTxnId] = useState<string | null>(null);
  const [reqId, setReqId] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const OPENID4VP_PROTOCOL = `${protocol || "openid4vp://"}authorize?`;

  const generateNonce = (): string => {
    return btoa(Date.now().toString());
  };

  const getPresentationDefinition = useCallback(
    (data: QrData) => {
      const params = new URLSearchParams();
      params.set("client_id", data.authorizationDetails.clientId);
      params.set("response_type", data.authorizationDetails.responseType);
      params.set("response_mode", "direct_post");
      params.set("nonce", data.authorizationDetails.nonce);
      params.set("state", data.requestId);
      params.set(
        "response_uri",
        verifyServiceUrl + data.authorizationDetails.responseUri
      );
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
        JSON.stringify({ client_name: window.location.origin, vp_formats: {} })
      );
      return params.toString();
    },
    [verifyServiceUrl]
  );

  const fetchVpResult = useCallback(async () => {
    try {
      if (onVPProcessed) {
        const response = await fetch(`${verifyServiceUrl}/vp-result/${txnId}`);
        if (response.status !== 200)
          throw new Error("Failed to fetch VP result");
        const vpVerificationResult = await response.json();
        const parsedVcResults: VerificationResult[] = vpVerificationResult.vcResults.map(
          (vcResult: { vc: any; verificationStatus: VerificationStatus }) => {
            return {
              vc: JSON.parse(vcResult.vc),
              vcStatus: vcResult.verificationStatus,
            };
          }
        );
        
        const vpResult: VerificationResults = {
          vcResults: parsedVcResults,
          vpResultStatus: vpVerificationResult.vpResultStatus,
        };
        onVPProcessed(vpResult);
        setTxnId(null);
        setReqId(null);
        setQrCodeData(null);
      }
      if (onVPReceived && txnId) {
        onVPReceived(txnId);
        setTxnId(null);
        setReqId(null);
        setQrCodeData(null);
      }
    } catch (error) {
      onError(error as Error);
      setTxnId(null);
      setReqId(null);
      setQrCodeData(null);
      setLoading(false);
    }
  }, [onVPProcessed, onVPReceived, onError, txnId, verifyServiceUrl]);

  const createVpRequest = useCallback(async () => {
    if (presentationDefinition?.input_descriptors.length !== 0) {
      try {
        addStylesheetRules();
        setLoading(true);
        const requestBody: VPRequestBody = {
          clientId: window.location.origin,
          nonce: generateNonce(),
        };

        if (txnId) requestBody.transactionId = txnId;
        if (presentationDefinitionId)
          requestBody.presentationDefinitionId = presentationDefinitionId;
        if (presentationDefinition)
          requestBody.presentationDefinition = presentationDefinition;

        const response = await fetch(`${verifyServiceUrl}/vp-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (response.status !== 201)
          throw new Error("Failed to create VP request");
        const data: QrData = await response.json();
        const qrData = OPENID4VP_PROTOCOL + getPresentationDefinition(data);
        setTxnId(data.transactionId);
        setReqId(data.requestId);
        setQrCodeData(qrData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        onError(error as Error);
      }
    }
  }, [
    presentationDefinition,
    txnId,
    presentationDefinitionId,
    verifyServiceUrl,
    OPENID4VP_PROTOCOL,
    getPresentationDefinition,
    onError,
  ]);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `${verifyServiceUrl}/vp-request/${reqId}/status`
      );
      if (response.status !== 200) throw new Error("Failed to fetch status");
      const data = await response.json();
      if (data.status === "ACTIVE") {
        fetchStatus();
      }
      if (data.status === "VP_SUBMITTED") {
        fetchVpResult();
      } else if (data.status === "EXPIRED") {
        setTxnId(null);
        setReqId(null);
        setQrCodeData(null);
        onQrCodeExpired();
      }
    } catch (error) {
      setLoading(false);
      onError(error as Error);
    }
  }, [verifyServiceUrl, reqId, onQrCodeExpired, onError, fetchVpResult]);

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
    if (!triggerElement) {
      createVpRequest();
    }
  }, [
    createVpRequest,
    onError,
    onQrCodeExpired,
    onVPProcessed,
    onVPReceived,
    presentationDefinition,
    presentationDefinitionId,
    triggerElement,
  ]);

  useEffect(() => {
    if (reqId) {
      fetchStatus();
    }
  }, [fetchStatus, reqId]);

  function addStylesheetRules() {
    let keyframes = `@keyframes spin {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}`;
    var styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    var styleSheet = styleEl.sheet;
    styleSheet?.insertRule(keyframes, 0);
  }

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
      {triggerElement && !qrCodeData && !loading ? (
        <div onClick={createVpRequest} style={{ cursor: "pointer" }}>
          {triggerElement}
        </div>
      ) : null}
      {loading && (
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #ccc",
            borderTop: "4px solid #333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "20px auto",
          }}
        ></div>
      )}
      {!loading && qrCodeData && (
        <div data-testid="qr-code">
          <QRCodeSVG
            value={qrCodeData}
            size={qrCodeStyles?.size || 200}
            level={qrCodeStyles?.level || "L"}
            bgColor={qrCodeStyles?.bgColor || "#ffffff"}
            fgColor={qrCodeStyles?.fgColor || "#000000"}
            marginSize={qrCodeStyles?.margin || 10}
            style={{ borderRadius: qrCodeStyles?.borderRadius || 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default OpenID4VPVerification;
