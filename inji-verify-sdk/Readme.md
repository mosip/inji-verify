# INJI VERIFY SDK

Inji Verify SDK is a library which exposes React components for integrating Inji Verify features seamlessly into any relaying party application.

## Features

- OpenId4VP component that creates QR code and performs OpenId4Vp sharing backend flow.

## Usage
`npm i @mosip/react-inji-verify-sdk`

[npm](https://www.npmjs.com/package/@mosip/react-inji-verify-sdk)

## Peer Dependencies

| Name       | Version |
|------------|---------|
| React      | 18.2.0  |
| TypeScript | 4.9.5   |


## Local Publishing Guide

Install the dependencies
`npm install`

Build the project
`npm run build`

Publish the npm package using Verdaccio
We use [verdaccio](https://verdaccio.org/docs/what-is-verdaccio). `npm link` or `yarn link` won't work as we have peer dependencies. Follow the docs to setup Verdaccio. Then run
`npm publish --registry http://localhost:<VERADACCIO_PORT>`

## Components
#### OpenID4VPVerification

##### Overview

The OPENID4VP UI Component is designed to facilitate the Verifiable Presentation (VP) verification process using the OpenID4VP specification. It interacts with the Relying Party UI, Verify Backend, and Wallet application to complete the verification process.

This document explains the sequence of operations performed by the component, along with the relevant API calls and callback handling.

##### Sequence of Operations

###### 1. Trigger (User Action)

The user initiates the verification process via the Relying Party UI by:
Clicking a "Verify" button. Opening the component where auto-verification is triggered.

###### 2. Configuration (Relying Party Setup)

The Relying Party UI configures the OPENID4VP UI Component with the following parameters described [here]("#component-props")

###### 3. VP Request Creation

The OPENID4VP UI Component sends a request to verifyServiceUrl/vp-request to initiate an Authorization Request. Either presentationDefinitionId or presentationDefinition must be provided in the request.

###### 4. Authorization Request (from Backend)

The Verify Backend processes the VP request. Generates a transactionId if not provided. Constructs an Authorization Request following the OpenID4VP standard. Returns the Authorization Request response to the OPENID4VP UI Component.

###### 5. QR Code Generation

The OPENID4VP UI Component generates a QR Code containing the Authorization Request Response. The QR Code is displayed to the user for scanning via their Wallet.

###### 6. Status Polling (Background Check)

The component continuously polls the verifyServiceUrl/vp-request/{reqId}/status endpoint. Status values include:
`ACTIVE` → Waiting for user action.
`VP_SUBMITTED` → User has submitted the VP.
`EXPIRED` → QR code expired.

###### 7. Wallet Interaction (User Action)

The user scans the QR Code with their Wallet. The Wallet extracts the presentation definition. Displays a list of matching Verifiable Credentials (VCs) available in the Wallet for user selection. Submits the selected VCs as a Verifiable Presentation (VP) Token to the Verify Backend.

###### 8. VP Token Submission (from Wallet)

The Wallet authenticates the user (if required) and submits the VP Token to the Verify Backend.

###### 9. Status Handling (/vp-request/{reqId}/status)

The OPENID4VP UI Component checks the status of the VP request:
- Case 1: QR Code Expired
  If the status returns `EXPIRED`, then the `onQrCodeExpired()` callback is triggered. Which notifies the Relying Party UI that the verification request has expired.

- Case 2: VP Submitted
  If the status returns `VP_SUBMITTED`, then the component requests the VP data from `verifyServiceUrl/vp-result/{txnId}`. This call retrieves the VP data. Once its retrieved the componnent validates the VP using the VC-Verifier library. Returns the validated verification result.
  - onVpProcessed(data) Execution: The onVpProcessed(data) callback is triggered. Passes the validated verification result to the Relying Party UI.

  - onVpReceived(txnId) Execution: The onVpReceived(txnId) callback is triggered. The Relying Party UI can now pass the txnId to its backend to fetch results from the Verify Backend.

###### 10. Error Handling

If an error occurs before reaching `VP_SUBMITTED`, the `onError(error)` callback is triggered. Common errors include,
- Failure to generate QR code.
- Issues communicating with the backend.
- Timeout during status polling.
- Invalid VP submission.

## Integration Guide

### OpenID4VPVerification

This guide walks you through integrating the OpenID4VPVerification component into your React TypeScript project. It facilitates Verifiable Presentation (VP) verification using the OpenID4VP protocol and supports flexible workflows, including client-side and backend-to-backend verification.

#### Prerequisites

- Ract Project Setup

> **NOTE**
The component does not support other frontend frameworks like Angular, Vue, or React Native.
The component is written in React + TypeScript


#### Backend Requirements

To use the component, you must host a verification backend that implements the OpenID4VP protocol. This backend is referred to as the [inji-verify-service]("../Readme.md"). It also needs to  adehere to the OpenAPI spec defined [here]("../docs/api-documentation-openapi.yaml") in case if the backend service is not inji-verify-service.

> ⚠️ Important: The component expects these endpoints to be accessible via a base URL (verifyServiceUrl).
Example:
If you deploy the inji-verify/verify-service at:
https://injiverify-service.example.com
Then use this as the verifyServiceUrl in the component:
verifyServiceUrl="https://injiverify-service.example.com/v1/verify"

#### Installation

`npm i @mosip/react-inji-verify-sdk`

#### Component Props

##### Exclusive Verification Flows
<br/>
> Only one of the following should be provided:


| Prop                                         | Description                                       |
|----------------------------------------------|---------------------------------------------------|
| `onVpReceived(txnId: string)`                  | Use when your backend fetches the VP result later |
| `onVpProcessed(vpResult: VerificationResults)` | Use when the frontend needs the result directly   |

##### Presentation Definition Options
<br/>
> Only one of the following should be provided:

| Prop                                         | Description                                       |
|----------------------------------------------|---------------------------------------------------|
| `presentationDefinitionId`                  | Fetch a predefined definition from the backend |
| `presentationDefinition` | Provide the full definition inline as a JSON object   |


##### Required Props
<br/>

| Prop             | Type                 | Description                            |
|------------------|----------------------|----------------------------------------|
| `verifyServiceUrl` | `string`               | Base URL for your verification backend |
| `protocol`        | `string`               | Protocol for QR (e.g.: `"openid4vp://"`) |
| `onQrCodeExpired`  | `() => void`           | Callback when QR expires               |
| `onError`          | `(err: Error) => void` | Error handler callback                 |

##### Optional Props
<br/>

| Prop           | Type            | Description                                         |
|----------------|-----------------|-----------------------------------------------------|
| `triggerElement` | `React.ReactNode` | Element that triggers verification (e.g., a button) |
| `transactionId`  | `string`          | Optional external tracking ID                       |
| `qrCodeStyles`   | `object`          | Customize QR appearance (size, color, margin, etc.) |

#### Integration Examples

##### VP Result via UI (frontend receives result)
<br/>

```
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
<br/>

```
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

- **Trigger Expiry** : Don’t scan the QR and wait for expiry to ensure onQrCodeExpired fires.

- **Force Errors** :
  - Stop the backend or simulate a 500 error.
  - Try missing required props or using both callbacks to see validation.


### Compatibility & Scope

##### Supported

- ✅ ReactJS (with TypeScript)

- ✅ Modern React projects (17+)

##### Not Supported

- ❌ React Native

- ❌ Angular, Vue, or other frontend frameworks

- ❌ SSR frameworks like Next.js without customization
