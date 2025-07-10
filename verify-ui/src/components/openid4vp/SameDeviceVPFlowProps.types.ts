export type VerificationStatus = "valid" | "invalid" | "expired";


export interface VerificationResult {
  /**
  
  Verified credential data (structured per implementation).
  */
  vc: Record<string, unknown>;

  /**
  
  The status of the verification.
  */
  vcStatus: VerificationStatus;
}

export type VerificationResults = VerificationResult[];

type ExclusiveCallbacks =
  /**
   * Callback triggered when the verification presentation (VP) is received.
   * Provides the associated transaction ID.
   */
  | { onVPReceived: (transactionId: string) => void; onVPProcessed?: never }
  /**
   * Callback triggered when the VP is successfully processed.
   * Provides the verification result data.
   */
  | {
      onVPProcessed: (VPResult: VerificationResults) => void;
      onVPReceived?: never;
    };


export interface Wallet {
  name: string;
  scheme: string;
  icon: string;
}

interface InputDescriptor {
  id: string;
  format?: {
    ldp_vc: {
      proof_type: string[];
    };
  };
  constraints?: {};
}

export interface PresentationDefinition {
  id?: string;
  purpose: string;
  format?: {
    ldp_vc: {
      proof_type: string[];
    };
  };
  input_descriptors: InputDescriptor[];
}

export type SameDeviceVPFlowProps = ExclusiveCallbacks & {
  triggerElement?: React.ReactNode;
  verifyServiceUrl: string;
  transactionId?: string;
  presentationDefinition: PresentationDefinition;
  presentationDefinitionId?: string;
  onError: (error: Error) => void;
};
