# INJI VERIFY SDK

Inji Verify SDK provides ready-to-use **React components** to integrate [OpenID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)-based **Verifiable Credential (VC) verification** into any React TypeScript web application.

---

## 📦 Installation

```bash
npm install @mosip/react-inji-verify-sdk
```

[npm package link](https://www.npmjs.com/package/@mosip/react-inji-verify-sdk)

---

## ⚙️ Backend Requirements (Prerequisite)

To use the SDK components, you must host a backend that implements the **OpenID4VP protocol**.

You can either:

- Use the official [`inji-verify-service`](../Readme.md), or  
- Build your own service that adheres to the [OpenAPI spec](../docs/api-documentation-openapi.yaml)

The backend should expose the following base URL:

```
https://your-backend.com/v1/verify
```

This becomes the `verifyServiceUrl` prop in both components.

> ⚠️ Note: These components are only compatible with React projects (not Angular, Vue, or React Native).

---

## 🚀 Usage Guide

### 🔐 OpenID4VPVerification Component

This component generates a **QR code** for VP request and supports:

- Backend-to-backend mode (`onVPReceived`)
- Frontend verification mode (`onVPProcessed`)

#### ✅ Required Props

| Prop                | Type                           | Description                                    |
|---------------------|--------------------------------|------------------------------------------------|
| `verifyServiceUrl`  | `string`                       | Backend base URL (e.g., `/v1/verify`)          |
| `onError`           | `(err: Error) => void`         | Error handler                                  |
| `onQrCodeExpired`   | `() => void`                   | Callback when QR code expires                  |

#### 🧩 Callback Mode (Choose Only One)

| Prop                   | Description                                           |
|------------------------|-------------------------------------------------------|
| `onVPProcessed`        | Gets VP verification result on frontend               |
| `onVPReceived`         | Gets txnId for backend to fetch VP result             |

#### 📄 Presentation Definition (Choose One)

| Prop                        | Description                                         |
|-----------------------------|-----------------------------------------------------|
| `presentationDefinitionId` | ID to fetch PD from backend                         |
| `presentationDefinition`    | Inline PD as JSON object                            |

#### ✍️ Example — Inline presentationDefinition Usage
If you want to directly provide a presentationDefinition instead of fetching it by ID, you can pass it like this:

```ts
const presentationDefinition = {
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
⚡ Tip: If you use presentationDefinition, do not pass presentationDefinitionId, and vice versa.


#### 🧩 Optional Props

| Prop               | Type               | Default           | Description                                       |
|--------------------|--------------------|--------------------|---------------------------------------------------|
| `protocol`         | `string`           | `"openid4vp://"`   | URI scheme used in the QR code                   |
| `triggerElement`   | `React.ReactNode`  | -                  | UI element to trigger verification               |
| `transactionId`    | `string`           | -                  | Optional tracking ID                             |
| `qrCodeStyles`     | `object`           | -                  | Customize QR appearance (size, color, etc.)      |

> 💡 If `protocol` is not provided, the component will default to `"openid4vp://"`.

#### 🔧 Example 1: Handle VP on Frontend

```tsx
<OpenID4VPVerification
  triggerElement={<button>Start VP Verification</button>}
  protocol="openid4vp://"
  verifyServiceUrl="https://verifier.example.com/v1/verify"
  presentationDefinitionId="example-definition-id"
  onVPProcessed={(vpResult) => {
    console.log("VP Verified:", vpResult);
  }}
  onQrCodeExpired={() => alert("QR expired")}
  onError={(err) => console.error("Verification error:", err)}
/>
```

#### 🔧 Example 2: Handle VP on Backend

```tsx
<OpenID4VPVerification
  triggerElement={<button>Verify using Wallet</button>}
  protocol="openid4vp://"
  verifyServiceUrl="https://verifier.example.com/v1/verify"
  presentationDefinition={{
    id: "custom-def",
    input_descriptors: [/* your PD here */],
  }}
  onVPReceived={(txnId) => {
    // Send txnId to your backend to fetch the result later
    console.log("txn ID:", txnId);
  }}
  onQrCodeExpired={() => alert("QR expired")}
  onError={(err) => console.error("Verification error:", err)}
/>
```

---

### 📷 QRCodeVerification Component

Use this to **scan or upload QR codes** that contain Verifiable Credentials and verify them.

#### ✅ Required Props

| Prop              | Type                         | Description                                         |
|-------------------|------------------------------|-----------------------------------------------------|
| `verifyServiceUrl`| `string`                     | Backend URL for VC verification                     |
| `onError`         | `(err: Error) => void`       | Error callback                                      |

#### 🧩 Callback Mode (Choose One)

| Callback          | Type                                     | Description                                     |
|-------------------|------------------------------------------|-------------------------------------------------|
| `onVCProcessed`   | `(vpResult: VerificationResults) => void`| Get VC + verification status directly           |
| `onVCReceived`    | `(txnId: string) => void`                | Get only txnId after VC submission              |

#### 🔧 Example: With `onVCProcessed`

```tsx
<QRCodeVerification 
  verifyServiceUrl="https://your-api/verify"
  onVCProcessed={(vpResult) => {
    console.log("VC + Status:", vpResult);
  }}
  onError={(e) => console.error("Error:", e.message)} 
  triggerElement={<div className="btn-primary">Verify Now</div>} 
/>
```

#### 🎨 Optional Props

| Prop                | Type                    | Default     | Description                                     |
|---------------------|-------------------------|-------------|-------------------------------------------------|
| `triggerElement`    | `React.ReactNode`       | `null`      | UI to trigger scan/upload                       |
| `transactionId`     | `string`                | `null`      | Optional tracking ID                            |
| `uploadButtonId`    | `string`                | `"upload-qr"` | ID for upload button                          |
| `uploadButtonStyle` | `React.CSSProperties`   | -           | Inline style for upload button                  |
| `isEnableUpload`    | `boolean`               | `true`      | Enable/disable QR image upload                  |
| `isEnableScan`      | `boolean`               | `true`      | Enable/disable live camera scan                 |
| `isEnableZoom`      | `boolean`               | `true`      | Enable pinch-zoom for mobile devices            |

#### 🖼️ Supported Upload Types

- PNG
- JPEG
- JPG
- PDF

---

## 📥 Redirect Behavior (Online Share)

If using **Online Share QR Code**, the wallet redirects to your RP app:

```
https://your-rp-domain.com/#vp_token=<base64url-encoded-token> 
```

You must extract and process the `vp_token` from the URL.

---

## 🔬 Testing

| Case                | How to Test                                                 |
|---------------------|-------------------------------------------------------------|
| **Wallet Scan**     | Use an OpenID4VP-compatible wallet to scan the QR           |
| **QR Expiry**       | Wait until the QR expires (no scan)                         |
| **Error Handling**  | Use missing props, simulate 500 errors, stop backend server |

---

## 🛠 Local Development / Publishing

> Only needed for contributors to the SDK

```bash
npm install      # Install dependencies
npm run build    # Build the project
```

For local publishing (using Verdaccio):

```bash
npm publish --registry http://localhost:<VERDACCIO_PORT>
```

---

## ✅ Compatibility

| Framework           | Supported |
|---------------------|-----------|
| React (17+)         | ✅ Yes     |
| React Native        | ❌ No      |
| Angular / Vue       | ❌ No      |
| SSR (Next.js)       | ⚠️ Only with customization |