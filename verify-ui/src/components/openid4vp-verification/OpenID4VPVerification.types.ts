type ExclusivePresentationDefinition =
  /**
   * ID of the presentation definition used for verification.
   * Required for some verification flows.
   */
  | { presentationDefinitionId: string; presentationDefinition?: never }
  /**
   * The full presentation definition JSON string.
   * If provided, it will be used instead of fetching from the backend.
   */
  | {
      presentationDefinition?: Record<string, unknown>;
      presentationDefinitionId?: never;
    };

type ExclusiveCallbacks =
  /**
   * Callback triggered when the verification presentation (VP) is received.
   * Provides the associated transaction ID.
   */
  | { onVpReceived: (transactionId: string) => void; onVpProcessed?: never }
  /**
   * Callback triggered when the VP is successfully processed.
   * Provides the verification result data.
   */
  | {
      onVpProcessed: (vpResult: VerificationResults) => void;
      onVpReceived?: never;
    };

export type OpenID4VPVerificationProps = ExclusivePresentationDefinition &
  ExclusiveCallbacks & {
    /**
     * React element that triggers the verification process (e.g., a button).
     * If not provided, the component may automatically start the process.
     */
    triggerElement?: React.ReactNode;

    /**
     * The backend service URL where the verification request will be sent.
     * This is a required field.
     */
    verifyServiceUrl: string;

    /**
     * A unique identifier for the transaction.
     * This is optional but recommended for tracking verification requests.
     */
    transactionId?: string;

    qrCodeStyles?: {
      /**
       * The size of the QR code in pixels.
       * Determines the width and height of the QR code.
       * @default 200
       */
      size?: number;

      /**
       * The error correction level of the QR code.
       * Determines how much damage the QR code can sustain while still being readable.
       * Options:
       *  - "L" (Low, ~7% recovery)
       *  - "M" (Medium, ~15% recovery)
       *  - "Q" (Quartile, ~25% recovery)
       *  - "H" (High, ~30% recovery)
       * @default "L"
       */
      level?: "L" | "M" | "Q" | "H";

      /**
       * The background color of the QR code.
       * Accepts any valid CSS color string (e.g., hex, rgb, rgba).
       * @default "#ffffff" (White)
       */
      bgColor?: string;

      /**
       * The foreground (QR code) color.
       * Accepts any valid CSS color string (e.g., hex, rgb, rgba).
       * @default "#000000" (Black)
       */
      fgColor?: string;

      /**
       * The margin around the QR code in pixels.
       * Helps ensure proper spacing for QR code scanning.
       * @default 10
       */
      margin?: number;

      /**
       * The borderRadius around the QR code in pixels.
       * Helps ensure proper spacing for QR code scanning.
       * @default 10
       */
      borderRadius?: number;
    };

    /**
     * Callback triggered when the QR code expires before verification is completed.
     */
    onQrCodeExpired: () => void;

    /**
     * Callback triggered when an error occurs during the verification process.
     * This is a required field to ensure proper error handling.
     */
    onError: (error: Error) => void;
  };

interface VerificationResult {
  /**
   * Verified credential data (structure depends on implementation).
   */
  vc: unknown;

  /**
   * The status of the verification (e.g., "valid", "invalid", "expired").
   */
  vcStatus: string;
}

type VerificationResults = VerificationResult[];

export interface QrData {
  /**
   * Unique transaction identifier.
   */
  transactionId: string;

  /**
   * Request identifier associated with the verification.
   */
  requestId: string;

  /**
   * Authorization details required for verification.
   */
  authorizationDetails: {
    responseType: string;
    clientId: string;
    presentationDefinition: Record<string, unknown>; // More precise than 'object'
    presentationDefinitionUri?: string;
    responseUri: string;
    nonce: string;
    iat: number;
  };

  /**
   * Expiration timestamp of the QR code.
   */
  expiresAt: number;
}

export interface vpRequestBody {
  clientId: string;
  nonce: string;
  transactionId?: string;
  presentationDefinitionId?: string;
  presentationDefinition?: Record<string, unknown>;
}
