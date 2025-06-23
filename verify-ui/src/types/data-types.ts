export type QrScanResult = {
  data: string | null;
  error: string | null;
  status: QrReadStatus;
};

export type QrReadStatus = "SUCCESS" | "NOT_READ" | "FAILED";

export type VcStatus = "SUCCESS" | "INVALID" | "EXPIRED" | "TIMEOUT";

export type RequestStatus = "ACTIVE" | "VP_SUBMITTED" | "EXPIRED";

export type VerificationStep = {
  label: string;
  description: string;
};

export type CardPositioning = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type AlertSeverity =
  | "success"
  | "info"
  | "warning"
  | "error"
  | undefined;

export type AlertInfo = {
  message?: string;
  severity?: AlertSeverity;
  open?: boolean;
  autoHideDuration?: number;
};

export type VerificationMethod = "SCAN" | "UPLOAD" | "VERIFY" | "TO_BE_SELECTED";

export type InternetConnectionStatus =
  | "ONLINE"
  | "OFFLINE"
  | "LOADING"
  | "UNKNOWN";

export type ApplicationState = {
  internetConnectionStatus: InternetConnectionStatus;
};

export type VerificationState = {
  method: VerificationMethod;
  activeScreen: number; // Verification steps
  qrReadResult?: QrReadResult | undefined;
  verificationResult?: VerificationResult;
  alert?: AlertInfo;
  ovp?: OvpFlowData;
};

export type QrReadResult = {
  alert?: AlertInfo;
  qrData?: object;
  status: QrReadStatus;
};

export type OvpFlowData = {
  presentationSubmission?: any;
  vpToken?: any;
};

export type VerificationTrigger = {};

export type VerificationResult = {
  vc?: VC;
  vcStatus?: VcStatus;
};

export type LanguageObject = {
  label: string;
  value: string;
};

export interface VerificationStepsContentType {
  SCAN: VerificationStep[];
  UPLOAD: VerificationStep[];
  VERIFY: VerificationStep[];
  TO_BE_SELECTED: VerificationStep[];
}

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export interface claim {
  name: string;
  type: string;
  logo: string;
  essential?: boolean;
  definition: PresentationDefinition;
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

interface PresentationDefinition {
  id?: string;
  purpose: string;
  format?: {
    ldp_vc: {
      proof_type: string[];
    };
  };
  input_descriptors: InputDescriptor[];
}

interface BodyType {
  transactionId: string;
  clientId: string;
  presentationDefinition: PresentationDefinition;
  nonce: string;
}

export type ApiRequest = {
  url: (...args: string[]) => string;
  methodType: MethodType;
  headers: (...args: string[]) => Record<string, string>;
  body?: BodyType;
};

export type VpRequestStatusApi = {
  url: (reqId: string) => string;
  methodType: MethodType;
  headers: (...args: string[]) => Record<string, string>;
  body?: BodyType;
};

export type VpSubmissionResultInt = {
  vc: VC;
  vcStatus: VcStatus;
  view?: boolean;
};

export type VerifyState = {
  isLoading: boolean;
  status: string;
  qrData: string;
  txnId: string;
  reqId: string;
  method: string;
  activeScreen: number;
  verificationSubmissionResult: VpSubmissionResultInt[];
  SelectionPanel: boolean;
  isShowResult: boolean;
  selectedClaims: claim[];
  originalSelectedClaims: claim[];
  unVerifiedClaims: claim[];
  sharingType: VCShareType;
  isPartiallyShared: boolean;
  presentationDefinition: PresentationDefinition;
};

export enum VCShareType {
  SINGLE = "single",
  MULTIPLE = "multiple",
}

export type QrData = {
  transactionId: string;
  requestId: string;
  authorizationDetails: {
    responseType: string;
    clientId: string;
    presentationDefinition: object;
    presentationDefinitionUri?: string;
    responseUri: string;
    nonce: string;
    iat: number;
  };
  expiresAt: number;
};

export type QrCodeProps = {
  title: string;
  data: string;
  size: number;
  footer?: string;
  status: "SUCCESS" | "EXPIRED" | "INVALID";
};

export type VC = {
  "@context": string[];
  credentialSubject: credentialSubject;
  expirationDate: string;
  id: string;
  issuanceDate: string;
  issuer: string;
  proof: {
    proofValue: string;
    created: string;
    proofPurpose: string;
    type: string;
    verificationMethod: string;
  };
  type: string[];
};

export type VCWrapper = {
  credential: VC
  credentialConfigurationId: string;
  issuerLogo: {
    url: string;
    alt_text: string;
  };
  wellKnown: string;
};

export type credentialSubject = {
  benefits: string[];
  gender: string;
  policyName: string;
  dob: string;
  mobile: string;
  policyNumber: string;
  fullName: string;
  policyIssuedOn: string;
  id: string;
  email: string;
  policyExpiresOn: string;
};

export interface fetchStatusResponse {
  status: string;
}

export type Detail = {
  key: string;
  value: string;
};