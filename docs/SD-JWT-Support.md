# SD-JWT Support in Inji Verify

## 🔍 Overview

Inji Verify now supports **Selective Disclosure JSON Web Tokens (SD-JWTs)** as a credential format.  
When Verifiable Credentials (VCs) are returned as SD-JWT strings, the UI decodes and renders them using the `@sd-jwt/decode` library.

This document explains:
- How SD-JWT fits into the existing OpenID4VP and verification flows
- How decoding is handled in the SDK/UI
- Error handling and integration guidelines

---

## 🧩 What is SD-JWT?

**SD-JWT (Selective Disclosure JWT)** is a JWT-based credential format that allows the holder to disclose only parts of the credential while keeping the rest hidden.  
It enables privacy-preserving presentations without revealing undisclosed claims.

Key characteristics:
- VCs may be encoded as **compact SD-JWT strings**
- Only disclosed claims are turned into a Verifiable Presentation
- Signature integrity is maintained

---

## 🏗 How SD-JWT Fits Into Inji Verify

When a wallet submits a Verifiable Presentation (VP), the embedded VC may be either:
- A JSON object, or
- An **SD-JWT string**

The backend verifies the VP and returns a `vpResult` to the UI.  
If the VC is a string, the UI decodes it using the SD-JWT library before displaying.

### Flow Summary

1. Wallet constructs VP  
2. Backend validates and returns `vpResult`  
3. UI checks if `vc` is a string  
4. If yes → decode using `@sd-jwt/decode`  
5. Display the claims and verification status

---

## 🧰 SDK / UI Integration

### ✅ Install Dependency

```bash
npm install @sd-jwt/decode@0.8.1-next.0
