import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./OpenID4VPVerification.module.css";
import {
  OpenID4VPVerificationProps,
  QrData,
  vpRequestBody,
} from "./OpenID4VPVerification.types";

const OpenID4VPVerification: React.FC<OpenID4VPVerificationProps> = ({
  triggerElement,
  verifyServiceUrl,
  presentationDefinitionId,
  presentationDefinition,
  onVpReceived,
  onVpProcessed,
  qrCodeStyles,
  onQrCodeExpired,
  onError,
}) => {
  const [txnId, setTxnId] = useState<string | null>(null);
  const [reqId, setReqId] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const OPENID4VP_PROTOCOL = "openid4vp://authorize?";

  const generateNonce = (): string => {
    return btoa(Date.now().toString());
  };

  const getPresentationDefinition = (data: QrData) => {
    return (
      `client_id=${data.authorizationDetails.clientId}` +
      `&response_type=${data.authorizationDetails.responseType}` +
      `&response_mode=direct_post` +
      `&nonce=${data.authorizationDetails.nonce}` +
      `&state=${data.requestId}` +
      `&response_uri=${
        verifyServiceUrl + data.authorizationDetails.responseUri
      }` +
      (data.authorizationDetails.presentationDefinitionUri
        ? `&presentation_definition_uri=${
            verifyServiceUrl +
            data.authorizationDetails.presentationDefinitionUri
          }`
        : `&presentation_definition=${JSON.stringify(
            data.authorizationDetails.presentationDefinition
          )}`) +
      `&client_metadata={"client_name":"${window.location.origin}", "vp_formats": {}}`
    );
  };

  const createVpRequest = async () => {
    try {
      setLoading(true);
      const requestBody: vpRequestBody = {
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
      const qrData = OPENID4VP_PROTOCOL + btoa(getPresentationDefinition(data));
      setTxnId(data.transactionId);
      setReqId(data.requestId);
      setQrCodeData(qrData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      onError(error as Error);
    }
  };

  const fetchStatus = async () => {
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
  };

  const fetchVpResult = async () => {
    try {
      if (onVpProcessed) {
        const response = await fetch(`${verifyServiceUrl}/vp-result/${txnId}`);
        if (response.status !== 200)
          throw new Error("Failed to fetch VP result");
        const VpVerificationResult = await response.json();
        const vcResults: { vc: unknown; vcStatus: string }[] = [];
        VpVerificationResult.vcResults.forEach(
          (vcResult: { vc: any; verificationStatus: string }) => {
            const vc = JSON.parse(vcResult.vc);
            const verificationStatus = vcResult.verificationStatus;
            vcResults.push({
              vc,
              vcStatus: verificationStatus,
            });
          }
        );
        onVpProcessed(vcResults);
        setTxnId(null);
        setReqId(null);
        setQrCodeData(null);
      }
      if (onVpReceived && txnId) {
        onVpReceived(txnId);
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
  };

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
    if (!onVpReceived && !onVpProcessed) {
      throw new Error(
        "Either onVpReceived or onVpProcessed must be provided, but not both"
      );
    }
    if (onVpReceived && onVpProcessed) {
      throw new Error(
        "Both onVpReceived and onVpProcessed cannot be provided simultaneously"
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
    onError,
    onQrCodeExpired,
    onVpProcessed,
    onVpReceived,
    presentationDefinition,
    presentationDefinitionId,
    triggerElement,
  ]);

  useEffect(() => {
    if (reqId) {
      fetchStatus();
    }
  }, [reqId]);

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
      {loading && <div className={styles.loader}></div>}
      {!loading && qrCodeData && (
        <div>
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
