import { FunctionComponent, SVGProps } from "react";

export interface Wallet {
  name: string;
  scheme: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  description?: string;
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

export interface SameDeviceVPFlowProps {
  verifyServiceUrl: string;
  transactionId?: string;
  presentationDefinition: PresentationDefinition;
  presentationDefinitionId?: string;
  fallbackUrl?: string;
  onError?: (message: string) => void;
}
