# INJI VERIFY SDK

Inji Verify SDK provides ready-to-use **React components** to integrate [OpenID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)-based **Verifiable Credential (VC) and Verifiable Presentation (VP) verification** into any React TypeScript web application.


## Usage Guide

### Step 1: Install the Package
```bash
npm i @mosip/react-inji-verify-sdk
```

### Step 2: Import and Use
```javascript
import { OpenID4VPVerification, QRCodeVerification } from "@mosip/react-inji-verify-sdk";
```

### Step 3: Choose Your Verification Method

**Option A: QR Code Verification (Scan & Upload)**
```javascript
function MyApp() {
  return (
    <QRCodeVerification
      verifyServiceUrl="https://your-backend.com/verify"
      onVCProcessed={(result) => {
        console.log("Verification complete:", result);
        // Handle the verification result here
      }}
      onError={(error) => {
        console.log("Something went wrong:", error);
      }}
      triggerElement={<button>📷 Scan ID Document</button>}
    />
  );
}
```

**Option B: OpenID4VP Verification**
```javascript
function MyApp() {
  return (
    <OpenID4VPVerification
      verifyServiceUrl="https://your-backend.com/v1/verify"
      presentationDefinitionId="your-definition-id"
      onVpProcessed={(result) => {
        console.log("Wallet verification complete:", result);
        // Handle the verification result here
      }}
      onQrCodeExpired={() => alert("QR code expired, please try again")}
      onError={(error) => console.log("Error:", error)}
      triggerElement={<button>📱 Verify with Digital Wallet</button>}
    />
  );
}
```

## Response Received

When verification is completed, the response received is as below:

```javascript
{
  vcResults: [
    {
      vc: { /* Your verified credential data */ },
      vcStatus: "SUCCESS" // or  "INVALID", "EXPIRED"
    }
  ],
  vpResultStatus: "SUCCESS" // Overall verification status
}
```
>**Security Recommendation**
>
>Avoid consuming results directly from VPProcessed or VCProcessed.
Instead, use VPReceived or VCReceived events to capture the txnId, then retrieve the verification results securely from your backend's verification service endpoint.
This ensures data integrity and prevents reliance on client-side verification data for final decisions.

## Pre-requisites

### What You Need:
1. **A React project** (TypeScript recommended)
2. **A verification backend** - You need a server that can verify credentials
3. **Camera permissions** - For QR scanning features

### Backend Requirements:
Your backend must support the OpenID4VP protocol. You can either:
- Use the official `inji-verify-service`
- Build your own following [this specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0-ID3.html)

**Important:** Your backend URL should look like:
```
https://your-backend.com
```

## 📖 Detailed Component Guide

### QRCodeVerification Component

**Perfect for:** Scanning QR codes from documents or uploading QR codes (PNG, JPEG, JPG, PDF)

#### Basic Setup:
```javascript
<QRCodeVerification
  verifyServiceUrl="https://your-backend.com"
  onVCProcessed={(result) => handleResult(result)}
  onError={(error) => handleError(error)}
  triggerElement={<button>Start Verification</button>}
/>
```

#### All Available Options:
```javascript
<QRCodeVerification
  // Required
  verifyServiceUrl="https://your-backend.com"
  onVCProcessed={(result) => console.log(result)}  // OR use onVCReceived
  onError={(error) => console.log(error)}

  // Optional
  triggerElement={<button>Custom Trigger</button>}
  transactionId="your-tracking-id"  //Optional
  uploadButtonId="my-upload-btn"
  uploadButtonStyle={{ backgroundColor: 'blue' }}
  isEnableUpload={true}        // Allow file uploads
  isEnableScan={true}          // Allow camera scanning  
  isEnableZoom={true}          // Allow camera zoom
/>
```

**Choose One Callback:**
- `onVCProcessed`: Get full verification results immediately
- `onVCReceived`: Get just a transaction ID (your backend handles the rest)

### OpenID4VPVerification Component

**Perfect for:** Integrating with digital wallets (like mobile ID apps)

#### Basic Setup:
```javascript
<OpenID4VPVerification
  verifyServiceUrl="https://your-backend.com"
  presentationDefinitionId="what-you-want-to-verify"
  onVpProcessed={(result) => handleResult(result)}
  onQrCodeExpired={() => alert("Please try again")}
  onError={(error) => handleError(error)}
/>
```

#### With Presentation Definition:
```javascript
<OpenID4VPVerification
  verifyServiceUrl="https://your-backend.com"
  presentationDefinition={"Refer Option 2 below"}
  onVpProcessed={(result) => console.log(result)}
  onQrCodeExpired={() => alert("QR expired")}
  onError={(error) => console.error(error)}
  triggerElement={<button>🔐 Verify Credentials</button>}
/>
```

#### Define What to Verify:

**Option 1: Use a predefined template**
```javascript
presentationDefinitionId="drivers-license-check"
```

**Option 2: Define exactly what you want**
```javascript
presentationDefinition={{
  id: "custom-verification",
  purpose: "We need to verify your identity",
  format: {
    ldp_vc: {
      proof_type: ["Ed25519Signature2020"],
    },
  },
  input_descriptors: [
    {
      id: "id-card-check",
      constraints: {
        fields: [
          {
            path: ["$.type"],
            filter: {
              type: "object",
              pattern: "DriverLicenseCredential",
            },
          },
        ],
      },
    },
  ],
}}
```

## 🎛️ Component Options Reference

### Common Props (Both Components)

| Property           | Type          | Required | Description                                 |
|--------------------|---------------|----------|---------------------------------------------|
| `verifyServiceUrl` | string        | ✅        | Your backend verification URL               |
| `onError`          | function      | ✅        | What to do when something goes wrong        |
| `triggerElement`   | React element | ❌        | Custom button/element to start verification |
| `transactionId`    | string        | ❌        | Your own tracking ID                        |

### QRCodeVerification Specific

| Property            | Type     | Default | Description                  |
|---------------------|----------|---------|------------------------------|
| `onVCProcessed`     | function | -       | Get full results immediately |
| `onVCReceived`      | function | -       | Get transaction ID only      |
| `isEnableUpload`    | boolean  | true    | Allow file uploads           |
| `isEnableScan`      | boolean  | true    | Allow camera scanning        |
| `isEnableZoom`      | boolean  | true    | Allow camera zoom            |
| `uploadButtonStyle` | object   | -       | Custom upload button styling |

### OpenID4VPVerification Specific

| Property                   | Type     | Default        | Description                        |
|----------------------------|----------|----------------|------------------------------------|
| `protocol`                 | string   | "openid4vp://" | Protocol for QR codes (optional)   |
| `presentationDefinitionId` | string   | -              | Predefined verification template   |
| `presentationDefinition`   | object   | -              | Custom verification rules          |
| `onVpProcessed`            | function | -              | Get full results immediately       |
| `onVpReceived`             | function | -              | Get transaction ID only            |
| `onQrCodeExpired`          | function | -              | Handle QR code expiration          |
| `isSameDeviceFlowEnabled`  | boolean  | true           | Enable same-device flow (optional) |
| `qrCodeStyles`             | object   | -              | Customize QR code appearance       |

## ⚠️ Important Limitations

- **React Only:** Won't work with Angular, Vue, or React Native
- **Backend Required:** You must have a verification service running