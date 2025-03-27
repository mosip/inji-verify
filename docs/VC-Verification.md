# Verifiable Credential Proof Verification

The Inji verify supports Verifiable Credential Proof Verification. This feature is available as an [API](https://mosip.stoplight.io/docs/inji-verify/branches/main/1r4yxmahkmbm9-get-the-submitted-vc-verified) in backend service.

The API takes the Verifiable Credential in body and performs a proof verifications and some validations returns the verification result as,

- **_SUCCESS_**
- **_INVALID_**
- **_EXPIRED_**

Inji Verify uses [vc-verifier](https://github.com/mosip/vc-verifier/tree/master/vc-verifier/kotlin) library for Verifiable Credential Proof Verification.

## Sequence Diagram

```mermaid
sequenceDiagram
participant VC Verifier
participant Verify Backend
participant Verify UI


    Verify UI->>Verify Backend: 1. Sent POST request to (BACKEND_URL/vc-verification) with VC in body
    Verify Backend->>VC Verifier: 2. Send VC for verification
    VC Verifier->>VC Verifier: 3. Perform VC Validation
    VC Verifier->>VC Verifier: 4. Perform VC Proof Verification
    VC Verifier->>Verify Backend: 5. Return the Verificaion Result (SUCCESS,EXPIRED,INVALID)
    Verify Backend->>Verify UI: 6. Return the Verificaion Result (SUCCESS,EXPIRED,INVALID)
    Verify UI->>Verify UI: 7. Render the Verificaion Result in UI
```
