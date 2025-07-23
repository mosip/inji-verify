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
  Wallet,
} from "./OpenID4VPVerification.types";
import { vpRequest, vpRequestStatus, vpResult } from "../../utils/api";
import WalletSelectionModal from "./WalletSelectionModal";
import { on } from "events";
import { Button } from "../Button/Button";

const isMobileDevice = () => {
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
  supportedWallets = [],
}) => {
  const [txnId, setTxnId] = useState<string | null>(transactionId || null);
  const [reqId, setReqId] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWallets, setShowWallets] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const hasInitializedRef = useRef(false);

  const shouldShowQRCode =
    !loading && qrCodeData && !showWallets && !showActionButtons;

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
        JSON.stringify({
          client_name: window.location.host,
          vp_formats: VPFormat,
        })
      );
      return params.toString();
    },
    [verifyServiceUrl, VPFormat]
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
          onQrCodeExpired();
          resetState();
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
        setShowActionButtons(true);
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
    setShowActionButtons(false);
  };

  const handleTriggerClick = () => {
    if (isEnableSameDeviceFlow && isMobileDevice()) {
      setShowActionButtons(true);
    } else {
      handleGenerateQRCode();
    }
  };

  const handleWalletOnCancel = () => {
    setSelectedWallet(null);
    setShowWallets(false);
    resetState();
    onError(new Error("Transaction Terminated"));
  };

  const handleWalletOnProceed = async () => {
    if (selectedWallet) {
      setShowWallets(false);
      const pdParams = await createVPRequest();
      const openidUrl = `${selectedWallet.scheme}authorize?${pdParams}`;
      window.location.href = openidUrl;
      fetchVPStatus();
    }
  };

  const handleGenerateQRCode = async () => {
    setShowActionButtons(false);
    const pdParams = await createVPRequest();
    const qrData = `${protocol || "openid4vp://"}authorize?${pdParams}`;
    setQrCodeData(qrData);
    setLoading(false);
    fetchVPStatus();
  };

  const handleOpenWallet = () => {
    setShowWallets(true);
    setShowActionButtons(false);
  };

  const SlideModal: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute bottom-0 w-full min-h-[500px]">
        <div className="slide-up-container">{children}</div>
      </div>
    </div>
  );

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

      {!loading && triggerElement && !qrCodeData && !showActionButtons && (
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

      {!loading &&
        showWallets &&
        isEnableSameDeviceFlow &&
        isMobileDevice() && (
          <WalletSelectionModal
            isOpen={showWallets}
            wallets={supportedWallets}
            selectedWallet={selectedWallet}
            onSelect={setSelectedWallet}
            onCancel={handleWalletOnCancel}
            onProceed={handleWalletOnProceed}
          />
        )}

      {!loading &&
        !qrCodeData &&
        !showWallets &&
        showActionButtons &&
        isEnableSameDeviceFlow &&
        isMobileDevice() && (
          <SlideModal>
            <div className="flex flex-col bg-white gap-4 mt-4 px-4 mb-4 py-6 rounded-lg shadow-lg">
              <Button
                title={"Generate QR Code"}
                onClick={handleGenerateQRCode}
                className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
                variant="fill"
              />
              <Button
                title={"Open Wallet"}
                onClick={handleOpenWallet}
                className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
                variant="fill"
              />
            </div>
          </SlideModal>
        )}
    </div>
  );
};

export default OpenID4VPVerification;
