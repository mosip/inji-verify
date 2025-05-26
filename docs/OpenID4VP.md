# OpenID4VP - Online Sharing Cross Device Flow

The Inji verify supports OpenID4VP specification draft 21 and this document provides a comprehensive overview of the process of initiating a OpenID4VP sharing flow to
wallets who can create and share the Verifiable Presentation online. It adheres to the OpenID4VP [specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0-21.html) which outlines the standards for
requesting and presenting Verifiable Credentials.

## Specifications supported
- The implementation follows OpenID for Verifiable Presentations - draft 21. [Specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0-21.html).
- Presentation Definition which adheres to the Presentation Exchange 2.0.0 [Specification](https://identity.foundation/presentation-exchange/spec/v2.0.0)
- VC format supported is Ldp Vc as of now.

## API Documentation
The API documentations can be found [here](https://mosip.stoplight.io/docs/inji-verify/branches/main/)

## Functionalities
##### Authorization Request Creation:
- Inji Verify can generate a QR code with authorization request which is created and obtained from Inji Verify backend. 
  - Below are the fields we expect in the creation of a new authorization request,
      - client_id
      - **_presentationDefinitionId_** or **_presentationDefinition_** (presentationDefinition - should adhere to the [Specification](https://identity.foundation/presentation-exchange/spec/v2.0.0)
      - transactionId (Optional) - will be generated at server if not provided
  - Inji verify Ui will make a request to backend to create the authorization request and the UI will render this as a QR code for the wallet to scan.

#####  Authorization Request Status:
- Inji Verify have API to get the current status of an authorization request.
    - The status will be,
      - **_ACTIVE_** - Authorization request is created but nor expired or any VP submission has been received. 
      - **_VP_SUBMITTED_** - VP has been submitted for authorization request.
      - **_EXPIRED_** - No VP submission happened within expiry time and the authorization request expired.
- This API call is a long poll call which will have a one-minute timeout.

#####  Verifiable Presentation Submission:
- Inji Verify have API to submit Verifiable Presentation.
- Once the wallet scans the QR code, wallet generates the VP token and submission request. This will be posted to the Inji verify backend.

#####  Submission Result:
- Once the wallet submits the VC, The status will be changed to **_VP_SUBMITTED_**.
- Inji verify UI can fetch the result of the submission through APIs. The result will contain two things.
  - Overall status of submission, either its **_SUCCESS_** or **_INVALID_**
  - List of VC with its own verification status.

## Sequence Diagram
```mermaid    
sequenceDiagram
    participant Verify Backend
    participant Verify UI
    participant Wallet


    Verify UI->>Verify Backend: 1. Create a Authorization Request (BACKEND_URL/vp-request)
    Verify Backend--)Verify Backend: 2. Process the request,<br> create and return Authorization Request response
    Verify Backend->>Verify UI: 3. Authorization Request Response
    Verify UI--)Verify UI: 4. Generate QR Code with response
    Verify UI--)Verify UI: 5. Polling Status BACKEND_URL/vp-request/${reqId}/status (ACTIVE, VP_SUBMITTED, EXPIRED)
    Wallet--)Wallet: 6. Scan QR Code
    Wallet--)Wallet: 7. Process the QR Data and List the matching VC's
    Wallet->>Verify Backend: 8.Authenticate User & Submits VP Token <br> (BACKEND_URL/vp-submission/direct-post)
    Verify Backend--)Verify UI: 9. Status == VP_SUBMITTED
    Verify UI->>Verify Backend: 10. Request the response from the respective endpoints <br> Ex- (BACKEND_URL/vp-result/${txnId})
    Verify Backend->>Verify UI: 11. Using txn_Id the server will fetch the data from DB and validate it using vc-verifier and return the response
    Verify UI--)Verify UI: 12. Render VC and its statuses accordingly
    
```