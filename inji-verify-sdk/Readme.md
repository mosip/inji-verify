# INJI VERIFY SDK

Inji Verify SDK is a library which exposes React components for integrating Inji Verify features seamlessly into any relaying party application.

## Features

- OpenId4VP component that creates QR code and performs OpenId4Vp sharing backend flow.
- QRCodeVerification component that allows scanning and uploading images to verify the verifiable credentials.

## Usage
`npm i @mosip/react-inji-verify-sdk`

[npm](https://www.npmjs.com/package/@mosip/react-inji-verify-sdk)

## Local Publishing Guide

Install the dependencies
`npm install`

Build the project
`npm run build`

Publish the npm package using Verdaccio
We use [verdaccio](https://verdaccio.org/docs/what-is-verdaccio). `npm link` or `yarn link` won't work as we have peer dependencies. Follow the docs to set up Verdaccio. Then run
`npm publish --registry http://localhost:<VERADACCIO_PORT>`

### Prerequisites

- React Project Setup

> **NOTE**
The component does not support other frontend frameworks like Angular, Vue, or React Native.
The component is written in React + TypeScript


### Backend Requirements

To use the component, you must host a verification backend that implements the OpenID4VP protocol. This backend is referred to as the [inji-verify-service]("../Readme.md"). It also needs to adhere to the OpenAPI spec defined [here]("../docs/api-documentation-openapi.yaml") in case if the backend service is not inji-verify-service.

> ⚠️ Important: The component expects these endpoints to be accessible via a base URL (verifyServiceUrl).
Example:
If you deploy the inji-verify/verify-service at:
https://injiverify-service.example.com
Then use this as the verifyServiceUrl in the component:
verifyServiceUrl="https://injiverify-service.example.com/v1/verify"

## Integration Guide

### OpenID4VPVerification

This guide walks you through integrating the OpenID4VPVerification component into your React TypeScript project. It facilitates Verifiable Presentation (VP) verification using the OpenID4VP protocol and supports flexible workflows, including client-side and backend-to-backend verification.

#### Component Props

##### Exclusive Verification Flows

> Only one of the following should be provided:


| Prop                                           | Description                                       |
|------------------------------------------------|---------------------------------------------------|
| `onVpReceived(txnId: string)`                  | Use when your backend fetches the VP result later |
| `onVpProcessed(vpResult: VerificationResults)` | Use when the frontend needs the result directly   |

##### `onVpProcessed` Response Structure
```ts
type vpResultStatus = "SUCCESS" | "FAILED";

/*
 * Individual VC verification result
 */
interface VerificationResult {
  /**
   * Verified credential data (structured per implementation).
   */
  vc: Record<string, unknown>;

  /**
   * The status of the individual VC.
   */
  vcStatus: VerificationStatus;
}

/*
 * Individual VP verification result
 */
interface VerificationResults {
    /**
     * Array of individual VC verification results.
     */
    vcResults: VerificationResult[];

    /**
     * The status of the overall Verifiable Presentation.
     */
    vpResultStatus: vpResultStatus;
}
```

#### Example Usage
```tsx
<OpenID4VPVerification
  triggerElement={<button>Start VP Verification</button>}
  protocol="openid4vp://"
  verifyServiceUrl="https://verifier.example.com/v1/verify"
  presentationDefinitionId="example-definition-id"
  onVpProcessed={(vpResult) => {
    console.log("VP Verification Results:", vpResult);
  }}
  onQrCodeExpired={() => alert("QR expired")}
  onError={(err) => console.error("Verification error:", err)}
/>;
```
#### Sample output structure:
```tx
VP Verification Results: {
    vcResults: [
        {
        vc: "",
        vcStatus: "",
        },
    ],
    vpResultStatus : "";
}
```

##### Presentation Definition Options

> Only one of the following should be provided:

| Prop                       | Description                                         |
|----------------------------|-----------------------------------------------------|
| `presentationDefinitionId` | Fetch a predefined definition from the backend      |
| `presentationDefinition`   | Provide the full definition inline as a JSON object |

#### Example — Inline presentationDefinition Usage

If you want to directly provide a Presentation Definition instead of fetching it by ID, you can pass it like this:

```js
presentationDefinition = {
  id: "c4822b58-7fb4-454e-b827-f8758fe27f9a",
  purpose:
    "Relying party is requesting your digital ID for the purpose of Self-Authentication",
  format: {
    ldp_vc: {
      proof_type: ["Ed25519Signature2020"],
    },
  },
  input_descriptors: [
    {
      id: "id card credential",
      format: {
        ldp_vc: {
          proof_type: ["Ed25519Signature2020"],
        },
      },
      constraints: {
        fields: [
          {
            path: ["$.type"],
            filter: {
              type: "object",
              pattern: "LifeInsuranceCredential",
            },
          },
        ],
      },
    },
  ],
};
```
> If you use `presentationDefinition`, do not pass `presentationDefinitionId`, and vice versa.

##### Required Props

| Prop               | Type                   | Description                              |
|--------------------|------------------------|------------------------------------------|
| `verifyServiceUrl` | `string`               | Base URL for your verification backend   |
| `protocol`         | `string`               | Protocol for QR (e.g.: `"openid4vp://"`) |
| `onQrCodeExpired`  | `() => void`           | Callback when QR expires                 |
| `onError`          | `(err: Error) => void` | Error handler callback                   |

##### Optional Props

| Prop             | Type              | Description                                         |
|------------------|-------------------|-----------------------------------------------------|
| `triggerElement` | `React.ReactNode` | Element that triggers verification (e.g., a button) |
| `transactionId`  | `string`          | Optional external tracking ID                       |
| `qrCodeStyles`   | `object`          | Customize QR appearance (size, color, margin, etc.) |

#### Integration Examples

##### VP Result via UI (frontend receives result)

```tsx
<OpenID4VPVerification
  triggerElement={<button>Start VP Verification</button>}
  protocol="openid4vp://"
  verifyServiceUrl="https://verifier.example.com/v1/verify"
  presentationDefinitionId="example-definition-id"
  onVpProcessed={(vpResult) => {
    console.log("VP Verified:", vpResult);
  }}
  onQrCodeExpired={() => alert("QR expired")}
  onError={(err) => console.error("Verification error:", err)}
/>
```

##### VP Result via Backend (frontend just gets txnId)

```tsx
<OpenID4VPVerification
  triggerElement={<button>Verify using Wallet</button>}
  protocol="openid4vp://"
  verifyServiceUrl="https://verifier.example.com/v1/verify"
  presentationDefinition={{
    id: "custom-def",
    input_descriptors: [/* your PD here */],
  }}
  onVpReceived={(txnId) => {
    // Send txnId to your backend to fetch the result later
    console.log("VP submission received, txn ID:", txnId);
  }}
  onQrCodeExpired={() => alert("QR expired")}
  onError={(err) => console.error("Verification error:", err)}
/>
```

#### Testing the Component (for QA)

- **Simulate Wallet Scan** : Use a mobile wallet app that supports OpenID4VP, or use mock tools to scan the QR code.

- **Trigger Expiry** : Don't scan the QR and wait for expiry to ensure onQrCodeExpired fires.

- **Force Errors** :
    - Stop the backend or simulate a 500 error.
    - Try missing required props or using both callbacks to see validation.

### QRCodeVerification
This guide walks you through integrating the QRCodeVerification component into your React TypeScript project. It facilitates QR code scanning and image upload to verify Verifiable Credentials (VCs) in your React application, including client-side and backend-to-backend verification.

#### Component Props
##### Required Props

| Prop                              | Type                     | Description                                             |
|-----------------------------------|--------------------------|---------------------------------------------------------|
| `verifyServiceUrl`                | `string`                 | Backend service URL for VC submission and verification. |
| `onError`                         | `(error: Error) => void` | Callback triggered on errors during scanning/upload.    |
| `onVCReceived` or `onVCProcessed` | See below                | Only one of these callbacks should be provided.         |

##### Callback Types
Use one of the following:

`onVCReceived`

```
onVCReceived: (txnId: string) => void;
```

Called when a Verifiable Presentation (VP) is received and submitted to the backend, returning the transaction ID

`onVCProcessed`

```
onVCProcessed: (vpResult: VerificationResults) => void;
```

Called when the VP is verified, returning an array of verification result objects:

```ts
type VerificationResult = {   vc: unknown;   vcStatus: "SUCCESS" | "INVALID" | "EXPIRED"; };  type VerificationResults = VerificationResult[];
```
> `onVCReceived` and `onVCProcessed` cannot be used simultaneously.

##### Required Props
| Prop                | Type                  | Default                   | Description                                                             |
|---------------------|-----------------------|:--------------------------|-------------------------------------------------------------------------|
| `triggerElement`    | `React.ReactNode`     | `null`                    | Optional trigger to initiate the scan/upload (e.g., a button or label). |
| `uploadButtonId`    | `(string`             | `"upload-qr"`             | Custom ID for upload button.                                            |
| `uploadButtonStyle` | `React.CSSProperties` | `"upload-button-default"` | Inline style object to apply custom styling to the upload button.       |
| `isEnableUpload`    | `boolean`             | `true`                    | Enables/disables QR-CODE image upload.                                  |
| `isEnableScan`      | `boolean`             | `true`                    | Enables/disables camera scanning.                                       |
| `isEnableZoom`      | `boolean`             | `true`                    | Enables camera zoom on mobile devices.                                  |

#### Upload Support
Upload supports the following image types:

* PNG
* JPEG
* JPG
* PDF

You can customize the upload button’s style using `uploadButtonStyle`, and control its placement with `uploadButtonId`.

#### Callback Behaviour
* `onVCReceived`: Used when you want the VC sent to a backend and just need a txnId response.
* `onVCProcessed`: Used for apps that handle VC verification client-side and want full VC + status.
* `onError`: Handles all runtime, parsing, and scanning errors.

> The component will clean up camera streams and timers on unmount.
 
##### Example with `onVCProcessed`

```tsx
<QRCodeVerification 
    verifyServiceUrl="https://your-api/verify"
    onVCProcessed={(vpResult) => { console.log("VC + Status:", vpResult)}}
    onError={(e) => console.error("Error:", e.message)} 
    triggerElement={<div className="btn-primary">Verify Now</div>} 
/>
```

##### Basic Usage

```tsx
import {QRCodeVerification} from "@mosip/react-inji-verify-sdk";
const App = () => {
  const handleVCReceived = (txnId: string) => {
    console.log("txnId received from VC submission:", txnId);
  };
  const handleError = (error: Error) => {
    console.error("Verification Error:", error.message);
  };
  return (
    <QRCodeVerification
      verifyServiceUrl="https://your-backend/verify"
      onVCReceived={handleVCReceived}
      onError={handleError}
      triggerElement={<button>Start Verification</button>}
    />
  );
};
```

#### Redirect Behavior

When using **Online Share QR Code**, the user is redirected to the client (issuer) server for processing, and then sent **back to the RP’s root path (`/`)** with the `vp_token` in the **URL fragment**:

```
https://your-rp-domain.com/#vp_token=<base64url-encoded-token>
```


### Compatibility & Scope

##### Supported

- ✅ ReactJS (with TypeScript)

- ✅ Modern React projects (17+)

##### Not Supported

- ❌ React Native

- ❌ Angular, Vue, or other frontend frameworks

- ❌ SSR frameworks like Next.js without customization