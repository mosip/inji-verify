import React, { useCallback, useEffect, useMemo, useRef, useState} from "react";
import { SameDeviceVPFlowProps, VerificationResults, Wallet} from "./SameDeviceVPFlowProps.types";
import { vpRequest } from "../../utils/api";
import WalletSelectionModal from "./WalletSelectionModal";
import { useAppDispatch } from "../../redux/hooks";
import { resetVpRequest } from "../../redux/features/verify/vpVerificationState";
import { VPRequests, SupportedWallets } from "../../utils/config";
import { decode } from "cbor-web";
import { decodeIssuerSignedNameSpaces } from "../../utils/cbore";

const SameDeviceVPFlow: React.FC<SameDeviceVPFlowProps> = ({
  triggerElement,
  verifyServiceUrl,
  onVPReceived,
  onVPProcessed,
  transactionId,
  presentationDefinition,
  presentationDefinitionId,
  onError,
}) => {
  const [authRequestUri, setAuthRequestUri] = useState<string | null>(null);
  const [showWallets, setShowWallets] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const dispatch = useAppDispatch();

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

  const presentationSubmission = useMemo(
    () => ({
      id: "dummy-submission",
      definition_id: "mDL-request-demo",
      descriptor_map: [
        {
          id: "org.iso.18013.5.1.mDL",
          path: "$",
          format: "mso_mdoc",
        },
      ],
    }),
    []
  );

  const fetchVPResult = useCallback(
    async (txnId: string) => {
      if (!txnId) {
        onError(new Error("Transaction ID is null, cannot fetch VP result."));
        return;
      }

      setIsLoading(true);
      try {
        if (onVPProcessed) {
          const response = await fetch(
            `${verifyServiceUrl}/vp-result/${txnId}`
          );
          if (!response.ok) throw new Error("Failed to fetch VP result");
          const result = await response.json();
          const VPResult: VerificationResults = result.vcResults.map(
            (vcResult: any) => ({
              vc: JSON.parse(vcResult.vc),
              vcStatus: vcResult.verificationStatus,
            })
          );
          onVPProcessed(VPResult);
          setIsLoading(false);
          setShowWallets(false);
          setAuthRequestUri(null);
          setSelectedWallet(null);
        } else {
          onVPReceived?.(txnId!);
          setIsLoading(false);
          setShowWallets(false);
          setAuthRequestUri(null);
          setSelectedWallet(null);
        }
      } catch (error) {
        onError(error as Error);
        setIsLoading(false);
        setShowWallets(false);
        setAuthRequestUri(null);
        setSelectedWallet(null);
      }
    },
    [onVPProcessed, verifyServiceUrl, onVPReceived, onError]
  );

  const fetchVPStatus = useCallback(
    (txnId: string, reqId: string) => {
      let cancelled = false;
      const poll = async () => {
        try {
          const res = await fetch(
            `${verifyServiceUrl}/vp-request/${reqId}/status`
          );
          if (!res.ok) throw new Error("Failed to fetch status");
          const status = await res.json();
          if (cancelled) return;
          if (status.status === "VP_SUBMITTED") {
            fetchVPResult(txnId);
          } else if (status.status === "ACTIVE") {
            fetchVPStatus(txnId, reqId);
          } else if (status.status === "EXPIRED") {
            setIsLoading(false);
          }
        } catch (err) {
          onError(err as Error);
          setIsLoading(false);
        }
      };
      poll();
      return () => {
        cancelled = true;
      };
    },
    [verifyServiceUrl, fetchVPResult, onError]
  );

  const getPresentationDefinitionParams = useCallback(
    (data: any) => {
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
    [VPFormat, verifyServiceUrl]
  );

  const fetchVPRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await vpRequest(
        verifyServiceUrl,
        transactionId ?? undefined,
        presentationDefinitionId,
        presentationDefinition
      );

      setAuthRequestUri(
        `openid4vp://authorize?${getPresentationDefinitionParams(data)}`
      );

      const supportsDigitalAPI =
        typeof navigator !== "undefined" &&
        "credentials" in navigator &&
        typeof navigator.credentials.get === "function";

      if (supportsDigitalAPI) {
        try {
          const controller = new AbortController();
          const vp = await (navigator as any).credentials.get({
            signal: controller.signal,
            mediation: "required",
            digital: {
              requests: VPRequests,
            },
          });
          if (vp) {
            const base64url = vp.data.vp_token.cred1;
            const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
            const binary = Uint8Array.from(atob(base64), (c) =>
              c.charCodeAt(0)
            );
            const decoded = decode(binary);
            const decodedVP =
              decoded instanceof Map ? Object.fromEntries(decoded) : decoded;

            const doc = decodedVP.documents?.[0];
            const claims = decodeIssuerSignedNameSpaces(doc);
            console.log("Decoded mDL Claims:", claims);
            const reconstructedVP = {
              "@context": ["https://www.w3.org/2018/credentials/v1"],
              type: ["VerifiablePresentation"],
              verifiableCredential: { ...claims },
              proof: {
                type: "Ed25519Signature2020",
                created: "2025-07-17T00:00:00Z",
                proofPurpose: "authentication",
                verificationMethod: "did:web:...#key-0",
                proofValue: "zBase58EncodedSignature",
              },
            };

            const body = new URLSearchParams();

            body.append("vp_token", JSON.stringify(reconstructedVP));
            body.append(
              "presentation_submission",
              JSON.stringify(presentationSubmission)
            );
            body.append("state", data.requestId);

            await fetch(`${verifyServiceUrl}/vp-submission/direct-post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body,
            });
            fetchVPStatus(data.transactionId, data.requestId);
          } else {
            fetchVPStatus(data.transactionId, data.requestId);
            setShowWallets(true);
          }
        } catch {
          fetchVPStatus(data.transactionId, data.requestId);
          setShowWallets(true);
        }
      } else {
        fetchVPStatus(data.transactionId, data.requestId);
        setShowWallets(true);
      }
    } catch (err) {
      onError(err as Error);
      setIsLoading(false);
    }
  }, [
    verifyServiceUrl,
    transactionId,
    presentationDefinitionId,
    presentationDefinition,
    getPresentationDefinitionParams,
    presentationSubmission,
    fetchVPStatus,
    onError,
  ]);

  const handleProceed = () => {
    if (authRequestUri) {
      window.location.href = authRequestUri;
    }
    setShowWallets(false);
  };

  const handleCancel = () => {
    setShowWallets(false);
    setIsLoading(false);
    setAuthRequestUri(null);
    setSelectedWallet(null);
    dispatch(resetVpRequest());
  };

  useEffect(() => {
    if (!triggerElement && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchVPRequest();
    }
  }, [fetchVPRequest, triggerElement]);

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
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="loader" />
        </div>
      )}

      {triggerElement && (
        <div
          onClick={() => {
            if (!hasFetchedRef.current) {
              hasFetchedRef.current = true;
              fetchVPRequest();
            }
          }}
          className="cursor-pointer"
        >
          {triggerElement}
        </div>
      )}

      {showWallets && (
        <WalletSelectionModal
          wallets={SupportedWallets}
          selectedWallet={selectedWallet}
          onSelect={setSelectedWallet}
          onCancel={handleCancel}
          onProceed={handleProceed}
          proceedDisabled={!authRequestUri}
        />
      )}
    </div>
  );
};

export default SameDeviceVPFlow;
