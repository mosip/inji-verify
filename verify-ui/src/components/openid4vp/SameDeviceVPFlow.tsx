import React, { useCallback, useMemo, useState } from "react";
import { SameDeviceVPFlowProps, Wallet } from "./SameDeviceVPFlowProps.types";
import { QrData } from "../../types/data-types";
import { vpRequest } from "../../utils/api";
import { OPENID4VP_PROTOCOL } from "../../utils/config";
import WalletSelectionModal from "./WalletSelectionModal";
import { Button } from "../Home/VerificationSection/commons/Button";
import { InjiLogo } from "../../utils/theme-utils";

const SUPPORTED_WALLETS: Wallet[] = [
  {
    name: "Inji Wallet",
    scheme: "injiwallet://vp-request",
    icon: InjiLogo,
    description:
      "Lorem ipsum dolor sit abet consectetur. Aliquot nils place rat.",
  },
  {
    name: "Talao Wallet",
    scheme: "talaowallet://vp-request",
    icon: InjiLogo,
    description:
      "Lorem ipsum dolor sit abet consectetur. Aliquot nils place rat.",
  },
];

const isMobileDevice = (): boolean =>
  /android|iphone|ipad|ipod/i.test(navigator.userAgent);

const SameDeviceVPFlow: React.FC<SameDeviceVPFlowProps> = ({
  verifyServiceUrl,
  transactionId,
  presentationDefinition,
  presentationDefinitionId,
  fallbackUrl = "https://injiweb.dev-int-inji.mosip.net/",
  onError,
}) => {
  const [txnId, setTxnId] = useState<string | null>(transactionId || null);
  const [showWallets, setShowWallets] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [authRequestUri, setAuthRequestUri] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

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

  const getPresentationDefinition = useCallback(
    (data: QrData) => {
      const params = new URLSearchParams();
      params.set("client_id", data.authorizationDetails.clientId);
      params.set("response_type", data.authorizationDetails.responseType);
      params.set("response_mode", "fragment");
      params.set("nonce", data.authorizationDetails.nonce);
      params.set("state", data.requestId);
      params.set("redirect_uri", encodeURIComponent(window.location.origin));
      params.set("client_id_scheme", "redirect_uri");

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

  const fetchData = async () => {
    try {
      const data = await vpRequest(
        verifyServiceUrl,
        txnId && txnId !== "null" ? txnId : undefined,
        presentationDefinitionId,
        presentationDefinition
      );
      const qrData =
        verifyServiceUrl +
        "/openid4vp/auth-request?" +
        getPresentationDefinition(data);
      setAuthRequestUri(qrData);
      setTxnId(data.transactionId);
    } catch (err) {
      onError?.("Failed to fetch presentation request.");
    }
  };

  const handleOpenWallet = () => {
    setShowWallets(true);
    fetchData();
  };

  const handleProceed = () => {
    // console.log("authRequestUri: ", encodeURIComponent(authRequestUri));

    if (!selectedWallet) return;

    // if (!isMobileDevice()) {
    //   window.location.href = fallbackUrl;
    //   onError?.(
    //     "This feature is only supported on mobile devices. Redirecting to wallet website."
    //   );
    //   return;
    // }

    if (!authRequestUri) {
      onError?.("Authorization request URI not ready yet.");
      return;
    }

    // 👇 encode and set full deeplink
    const deepLink = `${selectedWallet.scheme}?request_uri=${encodeURIComponent(authRequestUri)}`;

    console.log("Deep Link: ", deepLink);

    const timeout = setTimeout(() => {
      if (!launched) {
        // window.location.href = fallbackUrl;
        onError?.(
          `Wallet (${selectedWallet.name}) not detected, redirecting to download page.`
        );
      }
    }, 2000);

    try {
      // window.location.href = deepLink;
      setLaunched(true);
    } catch (err) {
      clearTimeout(timeout);
      onError?.(
        `Failed to initiate wallet redirect for ${selectedWallet.name}.`
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center">
        <Button
          id="verification-back-button"
          title={"Open Wallet"}
          className="w-full text-smallTextSize lg:text-sm"
          onClick={handleOpenWallet}
          disabled={presentationDefinition.input_descriptors.length === 0}
          fill
        />
      </div>

      {showWallets && (
        <WalletSelectionModal
          wallets={SUPPORTED_WALLETS}
          selectedWallet={selectedWallet}
          onSelect={setSelectedWallet}
          onCancel={() => setShowWallets(false)}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
};

export default SameDeviceVPFlow;
